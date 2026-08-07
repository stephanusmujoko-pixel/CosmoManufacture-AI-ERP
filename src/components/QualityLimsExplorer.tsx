import React, { useState } from 'react';
import {
  Microscope,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  FileText,
  Activity,
  Sparkles,
  Search,
  Filter,
  Plus,
  Boxes,
  Cpu,
  UserCheck,
  Thermometer,
  Gauge,
  Timer,
  Download,
  Share2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  QrCode,
  DollarSign,
  BarChart3,
  Bot,
  Sliders,
  Check,
  History,
  ShieldAlert,
  SlidersHorizontal,
  TestTube,
  FlaskConical,
  Award,
  Layers,
  FileSpreadsheet,
  Clock,
  Printer,
  Calendar,
  Settings,
  Scale,
  Zap,
  CheckSquare,
  ClipboardList,
  Building2,
  Fingerprint,
} from 'lucide-react';

// ==========================================
// TYPES FOR QC, QA & LIMS ENTERPRISE (PROMPT 14)
// ==========================================

export interface InspectionRecord {
  id: string;
  inspectionNo: string;
  type: 'IQC Raw Material' | 'IQC Packaging' | 'IPQC Compounding' | 'FGQC Finished Goods' | 'Packaging Line QC';
  itemCode: string;
  itemName: string;
  batchNumber: string;
  supplierOrLine: string;
  quantity: string;
  inspectionDate: string;
  inspectorName: string;
  status: 'Passed / Released' | 'QC Hold' | 'Rejected' | 'Under Testing';
  aqlLevel?: string;
  sampleCount: number;
  parametersTested: {
    name: string;
    specification: string;
    result: string;
    pass: boolean;
  }[];
  qcActionNotes: string;
}

export interface LaboratorySample {
  id: string;
  sampleCode: string;
  requestNumber: string;
  sourceType: 'Raw Material' | 'In-Process Bulk' | 'Finished Product' | 'Environmental Swab' | 'Purified Water WFI';
  batchNumber: string;
  itemName: string;
  samplingDate: string;
  sampledBy: string;
  analystAssigned: string;
  testCategory: 'Chemical & Physical' | 'Microbiology' | 'Heavy Metal' | 'Assay Active';
  status: 'In Testing' | 'Completed' | 'Pending Review' | 'Quarantine';
  priority: 'Urgent' | 'Routine' | 'High';
}

export interface InstrumentCalibration {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  brandModel: string;
  location: string;
  lastCalibrationDate: string;
  nextCalibrationDue: string;
  calibrationStatus: 'Calibrated / Valid' | 'Due Soon' | 'Out of Calibration';
  certNumber: string;
  calibratedBy: string;
}

export interface MicrobiologyTest {
  id: string;
  testNo: string;
  sampleName: string;
  batchNumber: string;
  testType: 'ALT (Angka Lempeng Total)' | 'AKBK (Kapang Khamir)' | 'Pathogen Screening' | 'Water WFI Bioburden' | 'Air Swab Cleanroom';
  specLimit: string;
  actualResult: string;
  incubationTemp: string;
  incubationHours: string;
  status: 'Passed (Negative)' | 'In Incubation' | 'Alert Limit Exceeded';
  testedBy: string;
}

export interface StabilityStudyProtocol {
  id: string;
  protocolCode: string;
  productName: string;
  batchNumber: string;
  studyType: 'Accelerated (40°C/75% RH)' | 'Real-Time (30°C/65% RH)' | 'Photostability';
  chamberCode: string;
  startDate: string;
  shelfLifeTargetMonths: number;
  pullSchedule: {
    timePoint: string;
    pullDate: string;
    status: 'Completed' | 'Scheduled' | 'Testing';
    pHResult?: number;
    viscosityCps?: number;
    organolepticPass?: boolean;
  }[];
  currentStatus: 'On-Going Passed' | 'Completed' | 'Out of Spec Alert';
}

export interface CoaDocument {
  id: string;
  coaNumber: string;
  batchNumber: string;
  productName: string;
  productCode: string;
  manufacturingDate: string;
  expiryDate: string;
  quantityProduced: string;
  clientName: string;
  approvedByQA: string;
  digitalSignatureHash: string;
  issueDate: string;
  status: 'Issued & Approved' | 'Pending QA Signature' | 'Revoked';
  testResults: {
    parameter: string;
    method: string;
    specification: string;
    result: string;
  }[];
}

export interface QualityDeviationCapa {
  id: string;
  caseNo: string;
  type: 'Deviation' | 'NCR (Non-Conformance)' | 'CAPA Action';
  severity: 'Critical' | 'Major' | 'Minor';
  title: string;
  batchNumber: string;
  department: 'Production Compounding' | 'Packaging Line' | 'Warehouse Raw' | 'Quality Lab';
  reportedDate: string;
  rootCause5Why: string[];
  fishboneCategory: 'Machine' | 'Method' | 'Material' | 'Manpower' | 'Environment';
  correctiveAction: string;
  preventiveAction: string;
  targetClosureDate: string;
  status: 'Under Investigation' | 'CAPA Implemented' | 'Closed & Verified';
  verifiedByQA: string;
}

export const QualityLimsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'iqc_ipqc_fgqc'
    | 'lims_lab'
    | 'microbiology'
    | 'stability'
    | 'coa_coc'
    | 'capa_deviation'
    | 'audit_regulatory'
    | 'ai_quality'
    | 'api_schema'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [showCoaModal, setShowCoaModal] = useState(false);
  const [showNewSampleModal, setShowNewSampleModal] = useState(false);
  const [showNewDeviationModal, setShowNewDeviationModal] = useState(false);
  const [selectedCoa, setSelectedCoa] = useState<CoaDocument | null>(null);

  // MOCK INSPECTIONS DATA
  const [inspections] = useState<InspectionRecord[]>([
    {
      id: 'INSP-001',
      inspectionNo: 'IQC-2026-0801',
      type: 'IQC Raw Material',
      itemCode: 'RM-NIA-001',
      itemName: 'Niacinamide USP / EP (Vitamin B3 99.8%)',
      batchNumber: 'LOT-DSM-20260715',
      supplierOrLine: 'DSM Nutritional Products Ltd',
      quantity: '500 Kg (20 Drums)',
      inspectionDate: '2026-08-01',
      inspectorName: 'Dewi Sartika, S.Farm.',
      status: 'Passed / Released',
      aqlLevel: 'Level II Normal (AQL 0.65)',
      sampleCount: 8,
      parametersTested: [
        { name: 'Kemurnian Assay', specification: '99.0% - 101.0%', result: '99.85%', pass: true },
        { name: 'Titik Leleh', specification: '128.0°C - 131.0°C', result: '129.4°C', pass: true },
        { name: 'Logam Berat (Pb)', specification: '< 10 ppm', result: '< 2 ppm', pass: true },
        { name: 'Susut Pengeringan', specification: '< 0.5%', result: '0.18%', pass: true },
      ],
      qcActionNotes: 'Sesuai spesifikasi COA Supplier. Status release ke gudang utama.',
    },
    {
      id: 'INSP-002',
      inspectionNo: 'IPQC-2026-0810',
      type: 'IPQC Compounding',
      itemCode: 'BULK-SRM-001',
      itemName: 'Bulk Serum CosmoGlow Brightening 1000L',
      batchNumber: 'BATCH-2026-SRM-088',
      supplierOrLine: 'Cleanroom Line A - Vessel 01',
      quantity: '610 Kg',
      inspectionDate: '2026-08-10',
      inspectorName: 'Ahmad Hidayat (QC Analyst)',
      status: 'Passed / Released',
      sampleCount: 3,
      parametersTested: [
        { name: 'Derajat pH (25°C)', specification: '5.20 - 5.80', result: '5.48', pass: true },
        { name: 'Viskositas Brookfield', specification: '3,000 - 4,000 cPs', result: '3,450 cPs', pass: true },
        { name: 'Bobot Jenis (SG)', specification: '1.020 - 1.050 g/mL', result: '1.035 g/mL', pass: true },
        { name: 'Organoleptik', specification: 'Cairan Jernih Agak Kental, Khas', result: 'Sesuai Standar', pass: true },
      ],
      qcActionNotes: 'In-Process QC Bulk Lulus. Siap ditransfer ke tangki penampung filling line.',
    },
    {
      id: 'INSP-003',
      inspectionNo: 'FGQC-2026-0812',
      type: 'FGQC Finished Goods',
      itemCode: 'FG-SRM-001',
      itemName: 'CosmoGlow Intense Brightening Serum 30ml',
      batchNumber: 'BATCH-2026-SRM-088',
      supplierOrLine: 'Packaging Line A (Dropper Bottle)',
      quantity: '20,000 Pcs',
      inspectionDate: '2026-08-12',
      inspectorName: 'Fitri Handayani, S.Si.',
      status: 'Passed / Released',
      aqlLevel: 'AQL 0.65 Major / 1.0 Minor',
      sampleCount: 125,
      parametersTested: [
        { name: 'Kebocoran Penetapan Volume', specification: '30.0 ml ± 0.5 ml', result: '30.2 ml', pass: true },
        { name: 'Torsi Capping Dropper', specification: '8.0 - 12.0 kgf.cm', result: '10.2 kgf.cm', pass: true },
        { name: 'Kerapihan Label & Barcode', specification: 'Grade A No Smudge', result: 'Lulus Scanned 100%', pass: true },
        { name: 'ALT Mikrobiologi (7 Hari)', specification: '< 100 CFU/g', result: '< 10 CFU/g (Pass)', pass: true },
      ],
      qcActionNotes: 'Lulus Uji Fisika, Kimia, & Mikrobiologi. COA Siap Diterbitkan oleh QA.',
    },
    {
      id: 'INSP-004',
      inspectionNo: 'IQC-2026-0814',
      type: 'IQC Packaging',
      itemCode: 'PKG-BOT-030',
      itemName: 'Botol Kaca Frosted Amber 30ml + Pipet Dropper Gold',
      batchNumber: 'LOT-GLASS-2026-99',
      supplierOrLine: 'PT Packaging Indah Utama',
      quantity: '50,000 Pcs',
      inspectionDate: '2026-08-14',
      inspectorName: 'Rudi Hermawan',
      status: 'QC Hold',
      aqlLevel: 'Level II AQL 1.0',
      sampleCount: 200,
      parametersTested: [
        { name: 'Uji Keretakan Thermal', specification: 'Bebas retak mikro', result: 'Retak mikro 2.5%', pass: false },
        { name: 'Presisi Ulir Botol', specification: 'Fit dengan Dropper', result: 'Sesuai Spec', pass: true },
      ],
      qcActionNotes: 'QC HOLD: Ditemukan keretakan mikro pada 5 dari 200 sampel (AQL Terlampaui). Menunggu keputusan NCR QA.',
    },
  ]);

  // MOCK LABORATORY SAMPLES DATA
  const [labSamples] = useState<LaboratorySample[]>([
    {
      id: 'SAMP-001',
      sampleCode: 'SMP-202608-001',
      requestNumber: 'TR-2026-088',
      sourceType: 'Finished Product',
      batchNumber: 'BATCH-2026-SRM-088',
      itemName: 'CosmoGlow Intense Brightening Serum 30ml',
      samplingDate: '2026-08-10 14:00',
      sampledBy: 'Budi Santoso',
      analystAssigned: 'Siti Aminah, Amd.AK',
      testCategory: 'Microbiology',
      status: 'Completed',
      priority: 'Urgent',
    },
    {
      id: 'SAMP-002',
      sampleCode: 'SMP-202608-002',
      requestNumber: 'TR-2026-089',
      sourceType: 'Purified Water WFI',
      batchNumber: 'LOOP-WFI-DAILY-10',
      itemName: 'Water For Injection (WFI) Loop Station 3',
      samplingDate: '2026-08-11 08:30',
      sampledBy: 'Eko Prasetyo',
      analystAssigned: 'Rina Kusuma, S.Si.',
      testCategory: 'Chemical & Physical',
      status: 'In Testing',
      priority: 'Routine',
    },
    {
      id: 'SAMP-003',
      sampleCode: 'SMP-202608-003',
      requestNumber: 'TR-2026-090',
      sourceType: 'Raw Material',
      batchNumber: 'LOT-DSM-20260715',
      itemName: 'Niacinamide USP Pure Powder',
      samplingDate: '2026-08-11 10:15',
      sampledBy: 'Dewi Sartika',
      analystAssigned: 'Bambang Supriyadi',
      testCategory: 'Heavy Metal',
      status: 'Completed',
      priority: 'Routine',
    },
  ]);

  // MOCK INSTRUMENT CALIBRATIONS
  const [instruments] = useState<InstrumentCalibration[]>([
    {
      id: 'EQ-LAB-01',
      equipmentCode: 'LAB-PH-01',
      equipmentName: 'Precision Benchtop pH Meter with Temp Probe',
      brandModel: 'Mettler Toledo SevenExcellence S400',
      location: 'Laboratorium Kimia Fisika',
      lastCalibrationDate: '2026-05-10',
      nextCalibrationDue: '2026-11-10',
      calibrationStatus: 'Calibrated / Valid',
      certNumber: 'CAL-MT-2026-88',
      calibratedBy: 'PT Kalibrasi Presisi Indonesia (External Kan)',
    },
    {
      id: 'EQ-LAB-02',
      equipmentCode: 'LAB-VISCO-02',
      equipmentName: 'Digital Rotational Viscometer DV2T',
      brandModel: 'Brookfield AMETEK DV2TRVT0',
      location: 'Laboratorium Kimia Fisika',
      lastCalibrationDate: '2026-02-15',
      nextCalibrationDue: '2026-08-15',
      calibrationStatus: 'Due Soon',
      certNumber: 'CAL-BF-2026-12',
      calibratedBy: 'Internal Maintenance & ISO Certified Standards',
    },
    {
      id: 'EQ-LAB-03',
      equipmentCode: 'LAB-HPLC-01',
      equipmentName: 'High Performance Liquid Chromatography (HPLC) UV-Vis',
      brandModel: 'Shimadzu Prominence LC-20AT',
      location: 'Laboratorium Analisis Instrumentasi',
      lastCalibrationDate: '2026-01-20',
      nextCalibrationDue: '2027-01-20',
      calibrationStatus: 'Calibrated / Valid',
      certNumber: 'CAL-SHM-2026-01',
      calibratedBy: 'Shimadzu Official Indonesia Service',
    },
  ]);

  // MOCK MICROBIOLOGY TESTS
  const [microTests] = useState<MicrobiologyTest[]>([
    {
      id: 'MICRO-001',
      testNo: 'MIC-2026-088',
      sampleName: 'CosmoGlow Serum 30ml (Retain Sample)',
      batchNumber: 'BATCH-2026-SRM-088',
      testType: 'ALT (Angka Lempeng Total)',
      specLimit: '< 100 CFU/g (BPOM Kosmetik)',
      actualResult: '< 10 CFU/g (Bebas Koloni)',
      incubationTemp: '32.5°C ± 2.0°C',
      incubationHours: '48 Jam',
      status: 'Passed (Negative)',
      testedBy: 'Amd. AK Ani Suryani',
    },
    {
      id: 'MICRO-002',
      testNo: 'MIC-2026-089',
      sampleName: 'Cleanroom Class D Air Swab (Filling Zone)',
      batchNumber: 'ENV-MON-2026-W32',
      testType: 'Air Swab Cleanroom',
      specLimit: '< 100 CFU/m³',
      actualResult: '12 CFU/m³ (Lulus)',
      incubationTemp: '35.0°C',
      incubationHours: '72 Jam',
      status: 'Passed (Negative)',
      testedBy: 'Amd. AK Ani Suryani',
    },
  ]);

  // MOCK STABILITY STUDY
  const [stabilityProtocols] = useState<StabilityStudyProtocol[]>([
    {
      id: 'STAB-001',
      protocolCode: 'STB-SRM-2026-01',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      batchNumber: 'BATCH-2026-SRM-088',
      studyType: 'Accelerated (40°C/75% RH)',
      chamberCode: 'CHAMBER-ACCEL-01',
      startDate: '2026-08-01',
      shelfLifeTargetMonths: 24,
      currentStatus: 'On-Going Passed',
      pullSchedule: [
        { timePoint: 'Bulan 0 (Initial)', pullDate: '2026-08-01', status: 'Completed', pHResult: 5.48, viscosityCps: 3450, organolepticPass: true },
        { timePoint: 'Bulan 1', pullDate: '2026-09-01', status: 'Scheduled' },
        { timePoint: 'Bulan 3', pullDate: '2026-11-01', status: 'Scheduled' },
        { timePoint: 'Bulan 6', pullDate: '2027-02-01', status: 'Scheduled' },
      ],
    },
  ]);

  // MOCK COA DOCUMENTS
  const [coaList] = useState<CoaDocument[]>([
    {
      id: 'COA-001',
      coaNumber: 'COA/2026/08/SRM-088',
      batchNumber: 'BATCH-2026-SRM-088',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      productCode: 'FG-SRM-001',
      manufacturingDate: '2026-08-10',
      expiryDate: '2028-08-10 (24 Bulan)',
      quantityProduced: '20,000 Pcs / Bottled',
      clientName: 'PT Glow Aesthetic Indonesia (Maklon)',
      approvedByQA: 'Eko Prasetyo, S.Farm., Apt. (Head of QA)',
      digitalSignatureHash: 'SHA256: 8f92a11b0e34c98782a12ff31405a8e32bc12903ef8841a0e1239bc',
      issueDate: '2026-08-12',
      status: 'Issued & Approved',
      testResults: [
        { parameter: 'Pemerian / Appearance', method: 'Organoleptik', specification: 'Cairan jernih kental, aroma khas floral', result: 'Sesuai Spesifikasi' },
        { parameter: 'Derajat pH (25°C)', method: 'Potensiometri (pH Meter)', specification: '5.20 - 5.80', result: '5.48' },
        { parameter: 'Viskositas (25°C)', method: 'Brookfield Spindle 3 @ 30RPM', specification: '3,000 - 4,000 cPs', result: '3,450 cPs' },
        { parameter: 'Kadar Niacinamide (Assay)', method: 'HPLC UV-Vis', specification: '4.80% - 5.20%', result: '5.02%' },
        { parameter: 'Cemaran Logam Berat Pb', method: 'AAS Spectrophotometry', specification: '< 20 ppm', result: '< 2 ppm (Lulus)' },
        { parameter: 'Angka Lempeng Total (ALT)', method: 'Pour Plate PCA (BPOM)', specification: '< 100 CFU/g', result: '< 10 CFU/g (Steril)' },
        { parameter: 'Pathogen Pseudomonas & Staph', method: 'Enrichment Media', specification: 'Negatif per 1 gram', result: 'Negatif (Lulus)' },
      ],
    },
  ]);

  // MOCK DEVIATIONS & CAPA
  const [deviations] = useState<QualityDeviationCapa[]>([
    {
      id: 'DEV-001',
      caseNo: 'DEV-2026-0810-01',
      type: 'Deviation',
      severity: 'Minor',
      title: 'Fluktuasi Suhu Fase Air Tank Compounding 78.2°C',
      batchNumber: 'BATCH-2026-SRM-088',
      department: 'Production Compounding',
      reportedDate: '2026-08-10',
      rootCause5Why: [
        'Mengapa suhu naik? Sensor thermostat chiller telat respon 2 menit.',
        'Mengapa telat respon? Adanya kotoran pada katup solenoid pendingin.',
        'Mengapa ada kotoran? Filtrasi pendingin belum dibersihkan pada jadwal PM mingguan.',
      ],
      fishboneCategory: 'Machine',
      correctiveAction: 'Pembersihan solenoid valve chiller dan verifikasi stabilitas active Niacinamide via HPLC (Hasil: 100% stabil).',
      preventiveAction: 'Pembaruan SOP Maintenance Preventif mingguan untuk pembersihan strainer filter chiller.',
      targetClosureDate: '2026-08-20',
      status: 'CAPA Implemented',
      verifiedByQA: 'Eko Prasetyo, Apt.',
    },
  ]);

  const handleOpenCoaModal = (coa: CoaDocument) => {
    setSelectedCoa(coa);
    setShowCoaModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 p-6 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 text-white shadow-lg">
                <Microscope className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Quality Control (QC), QA & LIMS Enterprise
                  </h1>
                  <span className="rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 14 • CPKB & LIMS
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Sistem Mutu Terintegrasi: IQC/IPQC/FGQC, Laboratory LIMS, Mikrobiologi Steril, Stability Study, Digital COA/COC, & CAPA Engine.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenCoaModal(coaList[0])}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg"
              id="view-coa-btn"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Cetak COA Batch PDF</span>
            </button>

            <button
              onClick={() => setShowNewSampleModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all"
            >
              <TestTube className="h-4 w-4 text-cyan-400" />
              <span>Registrasi Sampel Lab</span>
            </button>

            <button
              onClick={() => setShowNewDeviationModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-rose-950/80 px-3 py-2 text-xs font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-900 transition-all"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Log Deviasi / NCR</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_quality')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Quality Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>QC Hold Batch</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">1 Batch / Lot</p>
          <p className="text-[10px] text-amber-400 font-semibold">Gudang FEFO Blocked</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Inspeksi IQC Material</span>
            <Boxes className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">5 IQC Active</p>
          <p className="text-[10px] text-emerald-400 font-semibold">AQL Standard Passed</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Sampel Lab LIMS</span>
            <FlaskConical className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">12 Samples</p>
          <p className="text-[10px] text-cyan-400 font-semibold">Assay & Micro Running</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Air & Water Micro</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-400">100% Pass</p>
          <p className="text-[10px] text-emerald-300 font-bold">WFI & Class D Steril</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Stability Protocol</span>
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-lg font-black font-mono text-purple-300">4 Active</p>
          <p className="text-[10px] text-slate-400">24 Months Shelf Life</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Penerbitan COA</span>
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">100% Signed</p>
          <p className="text-[10px] text-slate-400">BPOM & Client Ready</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Realtime Control Center</span>
        </button>

        <button
          onClick={() => setActiveTab('iqc_ipqc_fgqc')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'iqc_ipqc_fgqc'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>IQC, IPQC & FGQC Inspections</span>
        </button>

        <button
          onClick={() => setActiveTab('lims_lab')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'lims_lab'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>LIMS & Instrument Calibration</span>
        </button>

        <button
          onClick={() => setActiveTab('microbiology')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'microbiology'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Microscope className="h-4 w-4" />
          <span>Microbiology & Environment</span>
        </button>

        <button
          onClick={() => setActiveTab('stability')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'stability'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Timer className="h-4 w-4" />
          <span>Stability Study & Shelf Life</span>
        </button>

        <button
          onClick={() => setActiveTab('coa_coc')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'coa_coc'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>COA & Certificate Generation</span>
        </button>

        <button
          onClick={() => setActiveTab('capa_deviation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'capa_deviation'
              ? 'bg-rose-600/20 text-rose-300 border-b-2 border-rose-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Deviation, NCR & CAPA Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_regulatory')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'audit_regulatory'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Audit & CPKB Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_quality')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'ai_quality'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>AI Quality Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('api_schema')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'api_schema'
              ? 'bg-slate-800 text-slate-200 border-b-2 border-slate-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>DB Entity & REST API</span>
        </button>
      </div>

      {/* SUB-TAB 1: REALTIME DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Active QC Holds & Release Pipeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm font-bold text-white">Status Live Pelepasan Mutu Batch (QC Release & Hold)</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold">
                  CPKB BPOM Verified
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {inspections.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.status === 'QC Hold'
                        ? 'bg-amber-950/40 border-amber-500/50'
                        : item.status === 'Passed / Released'
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-rose-950/40 border-rose-500/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-teal-300">{item.inspectionNo}</span>
                          <span className="text-[10px] text-slate-400">({item.type})</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">{item.itemName}</h4>
                        <p className="text-[11px] text-slate-400">Batch/Lot: {item.batchNumber} • Sumber: {item.supplierOrLine}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                            item.status === 'Passed / Released'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {item.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Inspektur: {item.inspectorName}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-lg text-[11px]">
                      {item.parametersTested.map((param, idx) => (
                        <div key={idx}>
                          <span className="text-slate-500 block text-[9px]">{param.name}</span>
                          <span className={`font-bold ${param.pass ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {param.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIMS Laboratory Sample Flow Tracker */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">LIMS Laboratory Live Testing Pipeline</h3>
                <button
                  onClick={() => setActiveTab('lims_lab')}
                  className="text-xs text-purple-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Buka Modul LIMS Complete</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {labSamples.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-bold">{s.sampleCode}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                        {s.testCategory}
                      </span>
                    </div>
                    <p className="text-white font-bold text-xs truncate">{s.itemName}</p>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <p>Batch: {s.batchNumber}</p>
                      <p>Analis: {s.analystAssigned}</p>
                    </div>
                    <div className="pt-1 flex items-center justify-between border-t border-slate-800/80 text-[10px]">
                      <span className="text-slate-400">{s.status}</span>
                      <span className="text-emerald-400 font-bold">✓ Standard Spec</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Instrument Calibration & AI Anomaly Alert */}
          <div className="space-y-6">
            {/* Calibration Alert Widget */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white">Jadwal Kalibrasi Alat Lab</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 border border-amber-500/30 px-2 py-0.5 rounded">
                  1 Alat Due Soon
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                {instruments.map((inst) => (
                  <div key={inst.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-[11px]">{inst.equipmentName}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{inst.equipmentCode} • {inst.location}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-400">Jatuh Tempo: {inst.nextCalibrationDue}</span>
                      <span
                        className={`font-bold ${
                          inst.calibrationStatus === 'Due Soon' ? 'text-amber-300' : 'text-emerald-400'
                        }`}
                      >
                        {inst.calibrationStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Quality Assistant Insight Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-amber-500/20 pb-2">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <h3 className="text-xs font-bold text-amber-200">AI Quality Intelligence</h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-amber-300 font-bold text-[11px]">1. Prediksi Stabilitas Formula</span>
                  <p className="text-slate-300 text-[11px]">
                    Berdasarkan data 30 hari chamber 40°C, viskositas Serum Brightening diprediksi stabil pada 3,420 cPs selama 24 bulan masa simpan.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-emerald-300 font-bold text-[11px]">2. Rekomendasi Ukuran Sampling AQL</span>
                  <p className="text-slate-300 text-[11px]">
                    Lot Botol Amber berikutnya disarankan dinaikkan ke Level III (AQL 0.4) menyusul mikro-crack yang terdeteksi di IQC supplier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: IQC, IPQC & FGQC INSPECTIONS */}
      {activeTab === 'iqc_ipqc_fgqc' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Inspeksi Mutu Terintegrasi: IQC, IPQC, FGQC & Packaging QC</h2>
              <p className="text-xs text-slate-400">
                Pencatatan Inspeksi Bahan Baku, Bahan Pengemas, Bulk In-Process Compounding, Produk Jadi, AQL Sampling, & Keputusan QC Release / Hold / Reject.
              </p>
            </div>

            <button
              onClick={() => alert('Membuka Formulir Inspeksi Baru...')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Inspeksi Baru</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">No. Inspeksi & Tipe</th>
                    <th className="p-3">Nama Barang / Material</th>
                    <th className="p-3">Batch / Lot Supplier</th>
                    <th className="p-3">Jumlah Sampel / AQL</th>
                    <th className="p-3">Inspektur & Tanggal</th>
                    <th className="p-3">Hasil Pengujian</th>
                    <th className="p-3">Keputusan Mutu</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {inspections.map((insp) => (
                    <tr key={insp.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold">
                        <div className="text-purple-300">{insp.inspectionNo}</div>
                        <span className="text-[10px] text-slate-400">{insp.type}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-white font-bold">{insp.itemName}</div>
                        <span className="text-[10px] text-slate-400">{insp.itemCode}</span>
                      </td>
                      <td className="p-3 text-amber-300 font-bold">{insp.batchNumber}</td>
                      <td className="p-3 text-slate-300">
                        {insp.sampleCount} Sampel
                        <div className="text-[10px] text-indigo-400">{insp.aqlLevel || 'Standard'}</div>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{insp.inspectorName}</div>
                        <span className="text-[10px] text-slate-500">{insp.inspectionDate}</span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5 text-[10px]">
                          {insp.parametersTested.slice(0, 2).map((p, idx) => (
                            <div key={idx} className="flex justify-between space-x-2">
                              <span className="text-slate-400">{p.name}:</span>
                              <span className={p.pass ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {p.result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            insp.status === 'Passed / Released'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {insp.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => alert(`Log Inspeksi ${insp.inspectionNo}\nCatatan: ${insp.qcActionNotes}`)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-purple-300 hover:bg-slate-800 text-[11px] font-bold"
                        >
                          Detail →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIMS & INSTRUMENT CALIBRATION */}
      {activeTab === 'lims_lab' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Laboratory Information Management System (LIMS) & Instrument Registry</h2>
            <p className="text-xs text-slate-400">
              Registrasi Sampel Lab, Assignment Analis, Metodologi Pengujian, Manajemen Reagen, Reference Standards, & Kalibrasi Peralatan Presisi (ISO 17025 / CPKB).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LIMS Registered Samples */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Daftar Sampel Uji LIMS Lab</h3>
                <button
                  onClick={() => setShowNewSampleModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-900"
                >
                  + Sampel Baru
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {labSamples.map((sample) => (
                  <div key={sample.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-300 font-bold">{sample.sampleCode}</span>
                      <span className="text-[10px] text-slate-400">{sample.requestNumber}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{sample.itemName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <p>Kategori Uji: <span className="text-amber-300">{sample.testCategory}</span></p>
                      <p>Analis: <span className="text-white">{sample.analystAssigned}</span></p>
                      <p>Sampling: <span className="text-slate-300">{sample.samplingDate}</span></p>
                      <p>Status: <span className="text-emerald-400 font-bold">{sample.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instrument Calibration Registry */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Registry & Kalibrasi Alat Laboratorium</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold">
                  GLP Ready
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {instruments.map((inst) => (
                  <div key={inst.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-300 font-bold">{inst.equipmentCode}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          inst.calibrationStatus === 'Due Soon'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {inst.calibrationStatus}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{inst.equipmentName}</h4>
                    <p className="text-[10px] text-slate-400">Model: {inst.brandModel} • Lokasi: {inst.location}</p>
                    <div className="flex justify-between text-[10px] border-t border-slate-800 pt-1.5 text-slate-300">
                      <span>Cert: {inst.certNumber}</span>
                      <span>Next Due: {inst.nextCalibrationDue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MICROBIOLOGY & ENVIRONMENT */}
      {activeTab === 'microbiology' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Laboratorium Mikrobiologi & Environmental Monitoring</h2>
            <p className="text-xs text-slate-400">
              Pengujian Sterilitas, Angka Lempeng Total (ALT), Angka Kapang Khamir (AKBK), Pathogen Screening, Bioburden Purified Water WFI, & Swab Udara Cleanroom.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">No. Uji Micro</th>
                    <th className="p-3">Sampel & Sumber</th>
                    <th className="p-3">Tipe Uji Mikrobiologi</th>
                    <th className="p-3">Batas Spesifikasi BPOM</th>
                    <th className="p-3">Hasil Pengamatan (CFU)</th>
                    <th className="p-3">Inkubasi Temp/Suhu</th>
                    <th className="p-3">Status Mikrobiologi</th>
                    <th className="p-3">Analis Micro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {microTests.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-emerald-300">{m.testNo}</td>
                      <td className="p-3">
                        <div className="text-white font-bold">{m.sampleName}</div>
                        <span className="text-[10px] text-slate-400">Batch: {m.batchNumber}</span>
                      </td>
                      <td className="p-3 text-amber-300 font-bold">{m.testType}</td>
                      <td className="p-3 text-slate-300">{m.specLimit}</td>
                      <td className="p-3 font-bold text-cyan-300">{m.actualResult}</td>
                      <td className="p-3 text-slate-300">{m.incubationTemp} ({m.incubationHours})</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{m.testedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: STABILITY STUDY */}
      {activeTab === 'stability' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Studi Stabilitas & Validasi Masa Simpan (Shelf Life)</h2>
            <p className="text-xs text-slate-400">
              Protokol Uji Stabilitas Dipercepat (Accelerated 40°C/75% RH) & Real-Time (30°C/65% RH), Penjadwalan Pulling Sampel, & Evaluasi Degradasi Formula.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            {stabilityProtocols.map((protocol) => (
              <div key={protocol.id} className="space-y-4 border-b border-slate-800 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-300">{protocol.protocolCode}</span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                        {protocol.studyType}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{protocol.productName}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Batch: {protocol.batchNumber} • Ruang Chamber: {protocol.chamberCode} • Mulai: {protocol.startDate}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {protocol.currentStatus}
                  </span>
                </div>

                {/* Pull Schedule Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
                  {protocol.pullSchedule.map((pull, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        pull.status === 'Completed'
                          ? 'bg-slate-900 border-emerald-500/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-white">{pull.timePoint}</span>
                        <span className={pull.status === 'Completed' ? 'text-emerald-400' : 'text-slate-500'}>
                          {pull.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Tanggal Pull: {pull.pullDate}</p>
                      {pull.pHResult && (
                        <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 border-t border-slate-800 pt-1">
                          <p>pH: <span className="text-amber-300 font-bold">{pull.pHResult}</span></p>
                          <p>Viskositas: <span className="text-cyan-300 font-bold">{pull.viscosityCps} cPs</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: COA & COC CERTIFICATE GENERATION */}
      {activeTab === 'coa_coc' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Penerbitan Certificate of Analysis (COA) & Compliance (COC)</h2>
              <p className="text-xs text-slate-400">
                Dokumen Sertifikat Hasil Uji Resmi CPKB BPOM dengan Tanda Tangan Digital SHA-256 & QR Code Verifikasi Audit Klien Maklon.
              </p>
            </div>

            <button
              onClick={() => handleOpenCoaModal(coaList[0])}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Preview COA Terakhir</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Nomor COA</th>
                    <th className="p-3">Nama Produk & Batch</th>
                    <th className="p-3">Penerima Klien Maklon</th>
                    <th className="p-3">Tanggal Produksi & Expiry</th>
                    <th className="p-3">Penanggung Jawab QA</th>
                    <th className="p-3">Status Sertifikat</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {coaList.map((coa) => (
                    <tr key={coa.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-teal-300">{coa.coaNumber}</td>
                      <td className="p-3">
                        <div className="text-white font-bold">{coa.productName}</div>
                        <span className="text-[10px] text-amber-300">Batch: {coa.batchNumber}</span>
                      </td>
                      <td className="p-3 text-slate-300">{coa.clientName}</td>
                      <td className="p-3 text-slate-300">
                        <div>MFG: {coa.manufacturingDate}</div>
                        <span className="text-[10px] text-emerald-400">EXP: {coa.expiryDate}</span>
                      </td>
                      <td className="p-3 text-slate-300">{coa.approvedByQA}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {coa.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenCoaModal(coa)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-teal-300 hover:bg-slate-800 text-[11px] font-bold"
                        >
                          Cetak PDF →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: CAPA, DEVIATION & NCR ENGINE */}
      {activeTab === 'capa_deviation' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Manajemen Deviasi, NCR (Non-Conformance) & CAPA Engine</h2>
              <p className="text-xs text-slate-400">
                Pencatatan Penyimpangan Mutu: Analisis Root Cause (5-Why & Ishikawa Fishbone), Tindakan Korektif/Preventif, & Verifikasi Efektivitas QA.
              </p>
            </div>

            <button
              onClick={() => setShowNewDeviationModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Log Deviasi / NCR Baru</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            {deviations.map((dev) => (
              <div key={dev.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-300 font-bold">{dev.caseNo}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30">
                      {dev.type} ({dev.severity})
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {dev.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{dev.title}</h3>
                <p className="text-slate-400 text-[11px]">
                  Batch: <span className="text-teal-300">{dev.batchNumber}</span> • Departemen: {dev.department} • Dilaporkan: {dev.reportedDate}
                </p>

                {/* 5 Why Interactive Root Cause Card */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <span className="text-amber-300 font-bold block text-[10px]">Analisis Root Cause (5-Why Method):</span>
                  {dev.rootCause5Why.map((why, idx) => (
                    <p key={idx} className="text-slate-300 pl-2 border-l-2 border-amber-500/40">
                      • {why}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block text-[10px]">Tindakan Korektif (Corrective Action):</span>
                    <p className="text-slate-300 mt-0.5">{dev.correctiveAction}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold block text-[10px]">Tindakan Preventif (Preventive Action):</span>
                    <p className="text-slate-300 mt-0.5">{dev.preventiveAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 8: AUDIT & CPKB COMPLIANCE */}
      {activeTab === 'audit_regulatory' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Quality Audit Internal/External & Matriks Kepatuhan CPKB / BPOM</h2>
            <p className="text-xs text-slate-400">
              Pengelolaan Audit Internal, Audit Supplier, Kepatuhan Standar ISO 22716, GMP, GLP, Halal LPPOM MUI, & Batas Bahan Terbatas (Regulatory Compliance).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                1. Status Sertifikasi Standar Regulasi
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900">
                  <span>CPKB BPOM RI (Cara Pembuatan Kosmetika Baik)</span>
                  <span className="text-emerald-400 font-bold">✓ Certified Valid 2028</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900">
                  <span>ISO 22716:2007 Cosmetics GMP</span>
                  <span className="text-emerald-400 font-bold">✓ Certified SGS</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900">
                  <span>Sertifikasi Halal BPJPH / MUI</span>
                  <span className="text-emerald-400 font-bold">✓ 100% System Halal</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                2. Jadwal Internal & Supplier Audit
              </h3>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between">
                  <div>
                    <p className="text-white font-bold">Internal Audit CPKB Q3 2026</p>
                    <p className="text-[10px] text-slate-400">Cakupan: Cleanroom & LIMS Laboratory</p>
                  </div>
                  <span className="text-amber-300 font-bold">Schedule: 25 Aug 2026</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between">
                  <div>
                    <p className="text-white font-bold">Supplier Audit: PT Packaging Indah</p>
                    <p className="text-[10px] text-slate-400">Evaluasi Keretakan Botol Amber</p>
                  </div>
                  <span className="text-cyan-300 font-bold">Schedule: 02 Sep 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: AI QUALITY ASSISTANT */}
      {activeTab === 'ai_quality' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
              <h2 className="text-sm font-bold text-white">AI Quality Control & Predictive Analytics Assistant</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Modul Inteligensi Buatan: Deteksi Anomali Viskositas/pH, Prediksi Reject Rate, Recommendation AQL Sampling, & Proyeksi Stabilitas Masa Simpan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>Prediksi Rate Rejection</span>
                <Bot className="h-4 w-4" />
              </div>
              <p className="text-slate-300 text-[11px]">
                Probability Reject Kemasan Botol Kaca Amber turun dari 2.5% menjadi 0.2% jika supplier melakukan annealing ulang.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-emerald-300 font-bold">
                <span>Deteksi Anomali pH Line A</span>
                <Activity className="h-4 w-4" />
              </div>
              <p className="text-slate-300 text-[11px]">
                Kurva pH serum stabil pada 5.48 (Toleransi 5.2 - 5.8). Tidak ditemukan tren keasaman abnormal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-cyan-300 font-bold">
                <span>AI Shelf-Life Validation</span>
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-slate-300 text-[11px]">
                Confidence score 99.4% untuk target masa simpan 24 Bulan tanpa degradasi warna atau aroma.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: DB ENTITIES & REST API */}
      {activeTab === 'api_schema' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Database Schema Entities & REST API Documentation (Prompt 14)</h2>
            <p className="text-xs text-slate-400">
              Spesifikasi Struktural Tabel Database Drizzle ORM / PostgreSQL & Endpoint REST API Backend LIMS/QC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-teal-300 border-b border-slate-800 pb-2">
                Database Entities (Prompt 14)
              </h3>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc pl-4">
                <li>quality_specifications</li>
                <li>inspection_plans & inspection_results</li>
                <li>sampling_plans</li>
                <li>laboratory_samples & laboratory_tests</li>
                <li>test_parameters & test_results</li>
                <li>coa_documents & coc_documents</li>
                <li>microbiology_tests</li>
                <li>stability_protocols & stability_results</li>
                <li>quality_deviations & quality_capa</li>
                <li>non_conformance_reports</li>
                <li>quality_audits</li>
                <li>instrument_calibrations</li>
                <li>laboratory_reagents & reference_standards</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2">
                REST API Endpoints (/api/v1/...)
              </h3>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/quality/inspections</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/quality/iqc</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/quality/ipqc</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/quality/fgqc</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/lims/samples</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/lims/calibrations</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/microbiology/tests</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/stability/protocols</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/coa/generate</li>
                <li><span className="text-emerald-400 font-bold">GET/POST</span> /api/capa/deviations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: CERTIFICATE OF ANALYSIS (COA) PDF */}
      {/* ========================================== */}
      {showCoaModal && selectedCoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl space-y-6 my-8">
            {/* COA Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  PT COSMO MANUFACTURE INDONESIA
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Kawasan Industri Jababeka V Block C-12, Cikarang, Jawa Barat • CPKB / GMP Certified
                </p>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  CERTIFICATE OF ANALYSIS (COA)
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-black bg-slate-900 text-white px-3 py-1 rounded">
                  {selectedCoa.coaNumber}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Tanggal Terbit: {selectedCoa.issueDate}</p>
              </div>
            </div>

            {/* Product Metadata Table */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] block">Nama Produk:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedCoa.productName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Klien / Pemilik Merek:</span>
                <span className="font-bold text-slate-900">{selectedCoa.clientName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Nomor Batch Produksi:</span>
                <span className="font-bold text-indigo-700">{selectedCoa.batchNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Tanggal MFG & EXP:</span>
                <span className="font-bold text-slate-900">{selectedCoa.manufacturingDate} s/d {selectedCoa.expiryDate}</span>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
                Hasil Uji Laboratorium Pengawasan Mutu (Quality Control)
              </h4>
              <table className="w-full text-left font-mono text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[10px] border-b border-slate-200">
                    <th className="p-2">Parameter Uji</th>
                    <th className="p-2">Metode Uji</th>
                    <th className="p-2">Spesifikasi Standar</th>
                    <th className="p-2">Hasil Analisis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {selectedCoa.testResults.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-2 font-bold text-slate-900">{row.parameter}</td>
                      <td className="p-2 text-slate-600">{row.method}</td>
                      <td className="p-2 text-slate-600">{row.specification}</td>
                      <td className="p-2 font-bold text-emerald-700">{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Conclusion & Digital Signature */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-slate-900 pt-4 text-xs font-mono">
              <div>
                <p className="text-slate-700 font-bold">Kesimpulan Mutu:</p>
                <p className="text-emerald-700 font-black text-sm">✓ DILUSKAN UNTUK EDAR & DISTRIBUSI (PASSED)</p>
                <p className="text-[9px] text-slate-500 mt-1 max-w-sm">
                  Segel Digital Hash: {selectedCoa.digitalSignatureHash}
                </p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-20 h-20 bg-slate-100 border border-slate-300 mx-auto flex items-center justify-center rounded p-1">
                  <QrCode className="h-16 w-16 text-slate-900" />
                </div>
                <p className="text-[10px] font-bold text-slate-900">{selectedCoa.approvedByQA}</p>
                <p className="text-[9px] text-slate-500">Head of Quality Assurance (Apoteker)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowCoaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
              >
                Tutup
              </button>
              <button
                onClick={() => alert('Mencetak COA Dokumen PDF Resmi dengan Stempel Digital...')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW LAB SAMPLE */}
      {showNewSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Registrasi Sampel Uji LIMS Baru
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Barang / Material</label>
                <input
                  type="text"
                  placeholder="e.g. Salicylic Acid 99% / Serum Bulk"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nomor Batch / Lot</label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-2026-SRM-089"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Kategori Pengujian LIMS</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500">
                  <option>Chemical & Physical</option>
                  <option>Microbiology (ALT/AKBK)</option>
                  <option>Heavy Metal Spectrometry</option>
                  <option>Assay Active HPLC</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowNewSampleModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Sampel LIMS Berhasil Didaftarkan dan Disimpan!');
                  setShowNewSampleModal(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500"
              >
                Simpan Sampel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW DEVIATION LOG */}
      {showNewDeviationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-rose-300 border-b border-slate-800 pb-2">
              Log Penyimpangan (Deviation / NCR) Baru
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Judul Deviasi Mutu</label>
                <input
                  type="text"
                  placeholder="e.g. Suhu Compounding Melebihi Toleransi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Tingkat Keparahan Risk</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500">
                  <option>Minor</option>
                  <option>Major</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Tindakan Penanganan Awal (Containment)</label>
                <textarea
                  rows={2}
                  placeholder="Tindakan langsung saat kejadian..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowNewDeviationModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Laporan Deviasi / NCR Berhasil Disimpan & Dikirimkan ke Tim QA!');
                  setShowNewDeviationModal(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white hover:bg-rose-500"
              >
                Kirimkan Laporan QA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
