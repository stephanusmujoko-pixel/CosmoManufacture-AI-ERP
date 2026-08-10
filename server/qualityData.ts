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

export const initialInspections: InspectionRecord[] = [
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
];

export const initialLabSamples: LaboratorySample[] = [
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
];

export const initialInstruments: InstrumentCalibration[] = [
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
    calibratedBy: 'PT Kalibrasi Presisi Indonesia (External KAN)',
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
];

export const initialMicroTests: MicrobiologyTest[] = [
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
];

export const initialStabilityProtocols: StabilityStudyProtocol[] = [
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
];

export const initialCoaDocuments: CoaDocument[] = [
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
];

export const initialDeviations: QualityDeviationCapa[] = [
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
];
