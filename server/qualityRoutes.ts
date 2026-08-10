import { Router, Request, Response } from 'express';
import {
  initialInspections,
  initialLabSamples,
  initialInstruments,
  initialMicroTests,
  initialStabilityProtocols,
  initialCoaDocuments,
  initialDeviations,
  InspectionRecord,
  LaboratorySample,
  InstrumentCalibration,
  MicrobiologyTest,
  StabilityStudyProtocol,
  CoaDocument,
  QualityDeviationCapa,
} from './qualityData.js';

export const qualityRouter = Router();

let inspectionsStore: InspectionRecord[] = [...initialInspections];
let labSamplesStore: LaboratorySample[] = [...initialLabSamples];
let instrumentsStore: InstrumentCalibration[] = [...initialInstruments];
let microTestsStore: MicrobiologyTest[] = [...initialMicroTests];
let stabilityStore: StabilityStudyProtocol[] = [...initialStabilityProtocols];
let coaStore: CoaDocument[] = [...initialCoaDocuments];
let deviationsStore: QualityDeviationCapa[] = [...initialDeviations];

// ----------------------------------------------------
// 1. INSPECTIONS (IQC / IPQC / FGQC)
// ----------------------------------------------------
qualityRouter.get('/quality/inspections', (req: Request, res: Response) => {
  res.json({ success: true, data: inspectionsStore, total: inspectionsStore.length });
});

qualityRouter.post('/quality/inspections', (req: Request, res: Response) => {
  const { type, itemCode, itemName, batchNumber, supplierOrLine, quantity, inspectorName, parametersTested, qcActionNotes, status } = req.body;

  if (!itemName || !batchNumber) {
    return res.status(400).json({ success: false, error: 'Item Name and Batch Number are required.' });
  }

  const newInspection: InspectionRecord = {
    id: `INSP-${Date.now().toString().slice(-4)}`,
    inspectionNo: `${type?.substring(0, 4) || 'INSP'}-2026-${(inspectionsStore.length + 1).toString().padStart(4, '0')}`,
    type: type || 'IQC Raw Material',
    itemCode: itemCode || 'RM-NEW-001',
    itemName,
    batchNumber,
    supplierOrLine: supplierOrLine || 'Internal Facility',
    quantity: quantity || '100 Units',
    inspectionDate: new Date().toISOString().substring(0, 10),
    inspectorName: inspectorName || 'Ahmad Hidayat (QC Analyst)',
    status: status || 'Passed / Released',
    sampleCount: 10,
    parametersTested: parametersTested || [
      { name: 'Uji Organoleptik & Penampilan', specification: 'Sesuai Standar', result: 'Lulus', pass: true },
      { name: 'Uji Derajat pH (25°C)', specification: '5.20 - 5.80', result: '5.50', pass: true },
    ],
    qcActionNotes: qcActionNotes || 'Inspeksi mutu telah diverifikasi dan disetujui oleh QC Inspector.',
  };

  inspectionsStore.unshift(newInspection);
  res.status(201).json({ success: true, message: 'Inspeksi mutu berhasil dicatat.', data: newInspection });
});

// Update inspection status (e.g. Release or QC Hold)
qualityRouter.patch('/quality/inspections/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, qcActionNotes } = req.body;

  const item = inspectionsStore.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Inspection record not found.' });
  }

  if (status) item.status = status;
  if (qcActionNotes) item.qcActionNotes = qcActionNotes;

  res.json({ success: true, message: `Status inspeksi ${item.inspectionNo} diperbarui ke ${item.status}`, data: item });
});

// ----------------------------------------------------
// 2. LIMS LABORATORY SAMPLES
// ----------------------------------------------------
qualityRouter.get('/lims/samples', (req: Request, res: Response) => {
  res.json({ success: true, data: labSamplesStore, total: labSamplesStore.length });
});

qualityRouter.post('/lims/samples', (req: Request, res: Response) => {
  const { itemName, batchNumber, testCategory, priority, sampledBy, analystAssigned, sourceType } = req.body;

  if (!itemName) {
    return res.status(400).json({ success: false, error: 'Item Name is required.' });
  }

  const newSample: LaboratorySample = {
    id: `SAMP-${Date.now().toString().slice(-4)}`,
    sampleCode: `SMP-202608-${(labSamplesStore.length + 1).toString().padStart(3, '0')}`,
    requestNumber: `TR-2026-${(100 + labSamplesStore.length + 1)}`,
    sourceType: sourceType || 'Finished Product',
    batchNumber: batchNumber || 'BATCH-NEW-2026',
    itemName,
    samplingDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    sampledBy: sampledBy || 'Dewi Sartika, S.Farm.',
    analystAssigned: analystAssigned || 'Siti Aminah, Amd.AK',
    testCategory: testCategory || 'Chemical & Physical',
    status: 'In Testing',
    priority: priority || 'Routine',
  };

  labSamplesStore.unshift(newSample);
  res.status(201).json({ success: true, message: 'Sampel lab LIMS berhasil didaftarkan.', data: newSample });
});

// ----------------------------------------------------
// 3. INSTRUMENT CALIBRATIONS
// ----------------------------------------------------
qualityRouter.get('/lims/instruments', (req: Request, res: Response) => {
  res.json({ success: true, data: instrumentsStore, total: instrumentsStore.length });
});

qualityRouter.post('/lims/instruments', (req: Request, res: Response) => {
  const { equipmentCode, equipmentName, brandModel, location, certNumber, calibratedBy, nextCalibrationDue } = req.body;

  const newInstrument: InstrumentCalibration = {
    id: `EQ-LAB-${Date.now().toString().slice(-4)}`,
    equipmentCode: equipmentCode || `LAB-EQ-${(instrumentsStore.length + 1).toString().padStart(2, '0')}`,
    equipmentName: equipmentName || 'Peralatan Lab Presisi Baru',
    brandModel: brandModel || 'Mettler Toledo / Brookfield',
    location: location || 'Laboratorium Kimia Fisika',
    lastCalibrationDate: new Date().toISOString().substring(0, 10),
    nextCalibrationDue: nextCalibrationDue || new Date(Date.now() + 180 * 86400000).toISOString().substring(0, 10),
    calibrationStatus: 'Calibrated / Valid',
    certNumber: certNumber || `CAL-ISO-${Math.floor(1000 + Math.random() * 9000)}`,
    calibratedBy: calibratedBy || 'Internal Maintenance & Standards',
  };

  instrumentsStore.unshift(newInstrument);
  res.status(201).json({ success: true, message: 'Log kalibrasi peralatan lab disetujui.', data: newInstrument });
});

// ----------------------------------------------------
// 4. MICROBIOLOGY & ENVIRONMENT
// ----------------------------------------------------
qualityRouter.get('/microbiology/tests', (req: Request, res: Response) => {
  res.json({ success: true, data: microTestsStore, total: microTestsStore.length });
});

qualityRouter.post('/microbiology/tests', (req: Request, res: Response) => {
  const { sampleName, batchNumber, testType, specLimit, actualResult, testedBy } = req.body;

  const newMicro: MicrobiologyTest = {
    id: `MICRO-${Date.now().toString().slice(-4)}`,
    testNo: `MIC-2026-${(microTestsStore.length + 1).toString().padStart(3, '0')}`,
    sampleName: sampleName || 'Sampel Uji Sterilitas Baru',
    batchNumber: batchNumber || 'BATCH-2026-SRM-090',
    testType: testType || 'ALT (Angka Lempeng Total)',
    specLimit: specLimit || '< 100 CFU/g (BPOM)',
    actualResult: actualResult || '< 10 CFU/g (Steril)',
    incubationTemp: '32.5°C ± 2.0°C',
    incubationHours: '48 Jam',
    status: 'Passed (Negative)',
    testedBy: testedBy || 'Amd. AK Ani Suryani',
  };

  microTestsStore.unshift(newMicro);
  res.status(201).json({ success: true, message: 'Hasil pengujian mikrobiologi berhasil disimpan.', data: newMicro });
});

// ----------------------------------------------------
// 5. STABILITY STUDIES
// ----------------------------------------------------
qualityRouter.get('/stability/protocols', (req: Request, res: Response) => {
  res.json({ success: true, data: stabilityStore, total: stabilityStore.length });
});

qualityRouter.post('/stability/protocols', (req: Request, res: Response) => {
  const { productName, batchNumber, studyType, chamberCode, shelfLifeTargetMonths } = req.body;

  const newProtocol: StabilityStudyProtocol = {
    id: `STAB-${Date.now().toString().slice(-4)}`,
    protocolCode: `STB-SRM-2026-${(stabilityStore.length + 1).toString().padStart(2, '0')}`,
    productName: productName || 'Produk Kosmetik Stabilitas Baru',
    batchNumber: batchNumber || 'BATCH-2026-SRM-090',
    studyType: studyType || 'Accelerated (40°C/75% RH)',
    chamberCode: chamberCode || 'CHAMBER-ACCEL-01',
    startDate: new Date().toISOString().substring(0, 10),
    shelfLifeTargetMonths: Number(shelfLifeTargetMonths) || 24,
    currentStatus: 'On-Going Passed',
    pullSchedule: [
      { timePoint: 'Bulan 0 (Initial)', pullDate: new Date().toISOString().substring(0, 10), status: 'Completed', pHResult: 5.50, viscosityCps: 3400, organolepticPass: true },
      { timePoint: 'Bulan 1', pullDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10), status: 'Scheduled' },
      { timePoint: 'Bulan 3', pullDate: new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10), status: 'Scheduled' },
      { timePoint: 'Bulan 6', pullDate: new Date(Date.now() + 180 * 86400000).toISOString().substring(0, 10), status: 'Scheduled' },
    ],
  };

  stabilityStore.unshift(newProtocol);
  res.status(201).json({ success: true, message: 'Protokol uji stabilitas baru berhasil dibuat.', data: newProtocol });
});

// ----------------------------------------------------
// 6. CERTIFICATE OF ANALYSIS (COA / COC)
// ----------------------------------------------------
qualityRouter.get('/coa/documents', (req: Request, res: Response) => {
  res.json({ success: true, data: coaStore, total: coaStore.length });
});

qualityRouter.post('/coa/generate', (req: Request, res: Response) => {
  const { batchNumber, productName, clientName, approvedByQA } = req.body;

  const newCoa: CoaDocument = {
    id: `COA-${Date.now().toString().slice(-4)}`,
    coaNumber: `COA/2026/08/SRM-${Math.floor(100 + Math.random() * 900)}`,
    batchNumber: batchNumber || 'BATCH-2026-SRM-088',
    productName: productName || 'CosmoGlow Intense Brightening Serum 30ml',
    productCode: 'FG-SRM-001',
    manufacturingDate: new Date().toISOString().substring(0, 10),
    expiryDate: new Date(Date.now() + 730 * 86400000).toISOString().substring(0, 10) + ' (24 Bulan)',
    quantityProduced: '20,000 Pcs',
    clientName: clientName || 'PT Paragonia Aesthetic Indonesia',
    approvedByQA: approvedByQA || 'Eko Prasetyo, S.Farm., Apt. (Head of QA)',
    digitalSignatureHash: `SHA256: ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    issueDate: new Date().toISOString().substring(0, 10),
    status: 'Issued & Approved',
    testResults: [
      { parameter: 'Pemerian / Appearance', method: 'Organoleptik', specification: 'Cairan jernih kental', result: 'Sesuai Spesifikasi' },
      { parameter: 'Derajat pH (25°C)', method: 'Potensiometri', specification: '5.20 - 5.80', result: '5.48' },
      { parameter: 'Kadar Niacinamide Active', method: 'HPLC UV-Vis', specification: '4.80% - 5.20%', result: '5.02%' },
      { parameter: 'ALT Mikrobiologi (BPOM)', method: 'Pour Plate PCA', specification: '< 100 CFU/g', result: '< 10 CFU/g (Pass)' },
    ],
  };

  coaStore.unshift(newCoa);
  res.status(201).json({ success: true, message: 'COA Resmi berhasil diterbitkan dengan Tanda Tangan Digital SHA256.', data: newCoa });
});

// ----------------------------------------------------
// 7. DEVIATIONS & CAPA
// ----------------------------------------------------
qualityRouter.get('/capa/deviations', (req: Request, res: Response) => {
  res.json({ success: true, data: deviationsStore, total: deviationsStore.length });
});

qualityRouter.post('/capa/deviations', (req: Request, res: Response) => {
  const { title, severity, batchNumber, department, correctiveAction, preventiveAction, rootCause5Why } = req.body;

  const newDev: QualityDeviationCapa = {
    id: `DEV-${Date.now().toString().slice(-4)}`,
    caseNo: `DEV-2026-0815-${(deviationsStore.length + 1).toString().padStart(2, '0')}`,
    type: 'Deviation',
    severity: severity || 'Minor',
    title: title || 'Penyimpangan Mutu Baru',
    batchNumber: batchNumber || 'BATCH-2026-SRM-088',
    department: department || 'Production Compounding',
    reportedDate: new Date().toISOString().substring(0, 10),
    rootCause5Why: rootCause5Why || [
      'Suhu tank compounding naik di atas toleransi 1.5°C.',
      'Solenoid valve chiller membutuhkan pembersihan filter.',
    ],
    fishboneCategory: 'Machine',
    correctiveAction: correctiveAction || 'Verifikasi ulang kadar bahan aktif via HPLC & pembersihan solenoid.',
    preventiveAction: preventiveAction || 'Pembaruan SOP Maintenance Preventif mingguan.',
    targetClosureDate: new Date(Date.now() + 10 * 86400000).toISOString().substring(0, 10),
    status: 'CAPA Implemented',
    verifiedByQA: 'Eko Prasetyo, Apt.',
  };

  deviationsStore.unshift(newDev);
  res.status(201).json({ success: true, message: 'Log deviasi & CAPA berhasil dibuat.', data: newDev });
});

// ----------------------------------------------------
// 8. AI QUALITY OOS & ANOMALY ANALYZER
// ----------------------------------------------------
qualityRouter.post('/quality/ai-analyze-oos', (req: Request, res: Response) => {
  const { parameter, specLimit, actualValue, batchNumber } = req.body;

  let severity = 'Low Risk';
  let recommendation = 'Lakukan re-testing sampel dari tangki yang sama secara homogen.';

  if (parameter?.toLowerCase().includes('ph') && (actualValue < 4.5 || actualValue > 6.5)) {
    severity = 'High Risk - Out of Spec (OOS)';
    recommendation = 'Hentikan proses filling. Tambahkan buffer pH adjuster atau terbitkan Log Deviasi/NCR ke QA!';
  } else if (parameter?.toLowerCase().includes('alt') || parameter?.toLowerCase().includes('micro')) {
    severity = 'CRITICAL - Contamination Out of Spec';
    recommendation = 'Karantina total batch (QC Hold FEFO). Lakukan swab test ulang pada nozzle filling & vessel compounding!';
  }

  res.json({
    success: true,
    analysis: {
      parameter,
      specLimit,
      actualValue,
      batchNumber,
      severity,
      recommendation,
      cpkbClause: 'Klausal 8.0 CPKB BPOM RI - Penanganan Produk Tidak Sesuai (Non-Conformance)',
    },
  });
});
