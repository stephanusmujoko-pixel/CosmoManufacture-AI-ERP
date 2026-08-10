import React, { useState, useEffect } from 'react';
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
  X,
  Play,
  Send,
} from 'lucide-react';
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
} from '../../server/qualityData';

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
  const [inspectionFilter, setInspectionFilter] = useState<string>('All');

  // Modals visibility
  const [showCoaModal, setShowCoaModal] = useState(false);
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false);
  const [showNewSampleModal, setShowNewSampleModal] = useState(false);
  const [showNewInstrumentModal, setShowNewInstrumentModal] = useState(false);
  const [showNewMicroModal, setShowNewMicroModal] = useState(false);
  const [showNewStabilityModal, setShowNewStabilityModal] = useState(false);
  const [showNewCoaModal, setShowNewCoaModal] = useState(false);
  const [showNewDeviationModal, setShowNewDeviationModal] = useState(false);

  // Selected Items
  const [selectedCoa, setSelectedCoa] = useState<CoaDocument | null>(null);

  // State Collections
  const [inspections, setInspections] = useState<InspectionRecord[]>(initialInspections);
  const [labSamples, setLabSamples] = useState<LaboratorySample[]>(initialLabSamples);
  const [instruments, setInstruments] = useState<InstrumentCalibration[]>(initialInstruments);
  const [microTests, setMicroTests] = useState<MicrobiologyTest[]>(initialMicroTests);
  const [stabilityProtocols, setStabilityProtocols] = useState<StabilityStudyProtocol[]>(initialStabilityProtocols);
  const [coaList, setCoaList] = useState<CoaDocument[]>(initialCoaDocuments);
  const [deviations, setDeviations] = useState<QualityDeviationCapa[]>(initialDeviations);

  // Form States
  const [newInspection, setNewInspection] = useState({
    type: 'IQC Raw Material' as InspectionRecord['type'],
    itemCode: '',
    itemName: '',
    batchNumber: '',
    supplierOrLine: '',
    quantity: '',
    inspectorName: 'Dewi Sartika, S.Farm.',
    param1Name: 'Assay / Kadar Kemurnian',
    param1Spec: '99.0% - 101.0%',
    param1Result: '99.85%',
    param2Name: 'Uji Organoleptik',
    param2Spec: 'Jernih Kental Khas',
    param2Result: 'Sesuai Standar',
    qcActionNotes: 'Lulus pengujian spesifikasi standar CPKB.',
  });

  const [newSample, setNewSample] = useState({
    itemName: '',
    batchNumber: '',
    sourceType: 'Finished Product' as LaboratorySample['sourceType'],
    testCategory: 'Chemical & Physical' as LaboratorySample['testCategory'],
    priority: 'Routine' as LaboratorySample['priority'],
    sampledBy: 'Budi Santoso',
    analystAssigned: 'Siti Aminah, Amd.AK',
  });

  const [newInstrument, setNewInstrument] = useState({
    equipmentCode: '',
    equipmentName: '',
    brandModel: '',
    location: 'Laboratorium Kimia Fisika',
    certNumber: '',
    calibratedBy: 'PT Kalibrasi Presisi Indonesia',
    nextCalibrationDue: '',
  });

  const [newMicro, setNewMicro] = useState({
    sampleName: '',
    batchNumber: '',
    testType: 'ALT (Angka Lempeng Total)' as MicrobiologyTest['testType'],
    specLimit: '< 100 CFU/g (BPOM)',
    actualResult: '< 10 CFU/g (Pass)',
    testedBy: 'Amd. AK Ani Suryani',
  });

  const [newStability, setNewStability] = useState({
    productName: '',
    batchNumber: '',
    studyType: 'Accelerated (40°C/75% RH)' as StabilityStudyProtocol['studyType'],
    chamberCode: 'CHAMBER-ACCEL-01',
    shelfLifeTargetMonths: 24,
  });

  const [newCoa, setNewCoa] = useState({
    batchNumber: '',
    productName: '',
    clientName: 'PT Glow Aesthetic Indonesia (Maklon)',
    approvedByQA: 'Eko Prasetyo, S.Farm., Apt. (Head of QA)',
  });

  const [newDeviation, setNewDeviation] = useState({
    title: '',
    severity: 'Minor' as QualityDeviationCapa['severity'],
    batchNumber: '',
    department: 'Production Compounding' as QualityDeviationCapa['department'],
    rootCause1: '',
    rootCause2: '',
    rootCause3: '',
    correctiveAction: '',
    preventiveAction: '',
  });

  // AI OOS Tool State
  const [aiOosInput, setAiOosInput] = useState({
    parameter: 'Derajat pH (25°C)',
    specLimit: '5.20 - 5.80',
    actualValue: '6.15',
    batchNumber: 'BATCH-2026-SRM-092',
  });
  const [aiOosResult, setAiOosResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // REST API Tester State
  const [apiEndpoint, setApiEndpoint] = useState('/api/quality/inspections');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiPayload, setApiPayload] = useState('{\n  "itemName": "Test Active Ingredient",\n  "batchNumber": "BATCH-TEST-001"\n}');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Initial Fetch from Backend
  useEffect(() => {
    fetchInspections();
    fetchLabSamples();
    fetchInstruments();
    fetchMicroTests();
    fetchStabilityProtocols();
    fetchCoaDocuments();
    fetchDeviations();
  }, []);

  const fetchInspections = async () => {
    try {
      const res = await fetch('/api/quality/inspections');
      const json = await res.json();
      if (json.success && json.data?.length) setInspections(json.data);
    } catch (e) {
      console.warn('Using local initialInspections fallback');
    }
  };

  const fetchLabSamples = async () => {
    try {
      const res = await fetch('/api/lims/samples');
      const json = await res.json();
      if (json.success && json.data?.length) setLabSamples(json.data);
    } catch (e) {
      console.warn('Using local initialLabSamples fallback');
    }
  };

  const fetchInstruments = async () => {
    try {
      const res = await fetch('/api/lims/instruments');
      const json = await res.json();
      if (json.success && json.data?.length) setInstruments(json.data);
    } catch (e) {
      console.warn('Using local initialInstruments fallback');
    }
  };

  const fetchMicroTests = async () => {
    try {
      const res = await fetch('/api/microbiology/tests');
      const json = await res.json();
      if (json.success && json.data?.length) setMicroTests(json.data);
    } catch (e) {
      console.warn('Using local initialMicroTests fallback');
    }
  };

  const fetchStabilityProtocols = async () => {
    try {
      const res = await fetch('/api/stability/protocols');
      const json = await res.json();
      if (json.success && json.data?.length) setStabilityProtocols(json.data);
    } catch (e) {
      console.warn('Using local initialStabilityProtocols fallback');
    }
  };

  const fetchCoaDocuments = async () => {
    try {
      const res = await fetch('/api/coa/documents');
      const json = await res.json();
      if (json.success && json.data?.length) setCoaList(json.data);
    } catch (e) {
      console.warn('Using local initialCoaDocuments fallback');
    }
  };

  const fetchDeviations = async () => {
    try {
      const res = await fetch('/api/capa/deviations');
      const json = await res.json();
      if (json.success && json.data?.length) setDeviations(json.data);
    } catch (e) {
      console.warn('Using local initialDeviations fallback');
    }
  };

  // Handlers for Submissions
  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      type: newInspection.type,
      itemCode: newInspection.itemCode || `ITM-${Math.floor(100 + Math.random() * 900)}`,
      itemName: newInspection.itemName,
      batchNumber: newInspection.batchNumber,
      supplierOrLine: newInspection.supplierOrLine || 'Gudang Utama / Cleanroom A',
      quantity: newInspection.quantity || '1,000 Units',
      inspectorName: newInspection.inspectorName,
      parametersTested: [
        { name: newInspection.param1Name, specification: newInspection.param1Spec, result: newInspection.param1Result, pass: true },
        { name: newInspection.param2Name, specification: newInspection.param2Spec, result: newInspection.param2Result, pass: true },
      ],
      qcActionNotes: newInspection.qcActionNotes,
      status: 'Passed / Released',
    };

    try {
      const res = await fetch('/api/quality/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInspections([json.data, ...inspections]);
      } else {
        throw new Error();
      }
    } catch (err) {
      const mockNew: InspectionRecord = {
        id: `INSP-${Date.now()}`,
        inspectionNo: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        type: newInspection.type,
        itemCode: newInspection.itemCode || 'RM-NEW-001',
        itemName: newInspection.itemName,
        batchNumber: newInspection.batchNumber,
        supplierOrLine: newInspection.supplierOrLine || 'Internal Facility',
        quantity: newInspection.quantity || '500 Pcs',
        inspectionDate: new Date().toISOString().substring(0, 10),
        inspectorName: newInspection.inspectorName,
        status: 'Passed / Released',
        sampleCount: 10,
        parametersTested: [
          { name: newInspection.param1Name, specification: newInspection.param1Spec, result: newInspection.param1Result, pass: true },
          { name: newInspection.param2Name, specification: newInspection.param2Spec, result: newInspection.param2Result, pass: true },
        ],
        qcActionNotes: newInspection.qcActionNotes,
      };
      setInspections([mockNew, ...inspections]);
    }

    setShowNewInspectionModal(false);
    setNewInspection({ ...newInspection, itemName: '', batchNumber: '' });
  };

  const handleToggleInspectionStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Passed / Released' ? 'QC Hold' : 'Passed / Released';
    setInspections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
    );

    try {
      await fetch(`/api/quality/inspections/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // local state already updated
    }
  };

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lims/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSample),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setLabSamples([json.data, ...labSamples]);
      } else {
        throw new Error();
      }
    } catch (e) {
      const local: LaboratorySample = {
        id: `SAMP-${Date.now()}`,
        sampleCode: `SMP-202608-${Math.floor(100 + Math.random() * 900)}`,
        requestNumber: `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
        sourceType: newSample.sourceType,
        batchNumber: newSample.batchNumber || 'BATCH-2026-NEW',
        itemName: newSample.itemName,
        samplingDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sampledBy: newSample.sampledBy,
        analystAssigned: newSample.analystAssigned,
        testCategory: newSample.testCategory,
        status: 'In Testing',
        priority: newSample.priority,
      };
      setLabSamples([local, ...labSamples]);
    }

    setShowNewSampleModal(false);
    setNewSample({ ...newSample, itemName: '', batchNumber: '' });
  };

  const handleCreateInstrument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lims/instruments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstrument),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInstruments([json.data, ...instruments]);
      } else throw new Error();
    } catch (e) {
      const local: InstrumentCalibration = {
        id: `EQ-LAB-${Date.now()}`,
        equipmentCode: newInstrument.equipmentCode || `LAB-EQ-${Math.floor(10 + Math.random() * 90)}`,
        equipmentName: newInstrument.equipmentName,
        brandModel: newInstrument.brandModel || 'Precision Instrument',
        location: newInstrument.location,
        lastCalibrationDate: new Date().toISOString().substring(0, 10),
        nextCalibrationDue: newInstrument.nextCalibrationDue || '2027-02-15',
        calibrationStatus: 'Calibrated / Valid',
        certNumber: newInstrument.certNumber || `CAL-${Math.floor(1000 + Math.random() * 9000)}`,
        calibratedBy: newInstrument.calibratedBy,
      };
      setInstruments([local, ...instruments]);
    }

    setShowNewInstrumentModal(false);
    setNewInstrument({ ...newInstrument, equipmentName: '', equipmentCode: '' });
  };

  const handleCreateMicro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/microbiology/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMicro),
      });
      const json = await res.json();
      if (json.success && json.data) setMicroTests([json.data, ...microTests]);
      else throw new Error();
    } catch (e) {
      const local: MicrobiologyTest = {
        id: `MICRO-${Date.now()}`,
        testNo: `MIC-2026-${Math.floor(100 + Math.random() * 900)}`,
        sampleName: newMicro.sampleName,
        batchNumber: newMicro.batchNumber || 'BATCH-2026-SRM-088',
        testType: newMicro.testType,
        specLimit: newMicro.specLimit,
        actualResult: newMicro.actualResult,
        incubationTemp: '32.5°C ± 2.0°C',
        incubationHours: '48 Jam',
        status: 'Passed (Negative)',
        testedBy: newMicro.testedBy,
      };
      setMicroTests([local, ...microTests]);
    }

    setShowNewMicroModal(false);
    setNewMicro({ ...newMicro, sampleName: '', batchNumber: '' });
  };

  const handleCreateStability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stability/protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStability),
      });
      const json = await res.json();
      if (json.success && json.data) setStabilityProtocols([json.data, ...stabilityProtocols]);
      else throw new Error();
    } catch (e) {
      const local: StabilityStudyProtocol = {
        id: `STAB-${Date.now()}`,
        protocolCode: `STB-SRM-2026-${Math.floor(10 + Math.random() * 90)}`,
        productName: newStability.productName,
        batchNumber: newStability.batchNumber || 'BATCH-2026-SRM-088',
        studyType: newStability.studyType,
        chamberCode: newStability.chamberCode,
        startDate: new Date().toISOString().substring(0, 10),
        shelfLifeTargetMonths: newStability.shelfLifeTargetMonths,
        currentStatus: 'On-Going Passed',
        pullSchedule: [
          { timePoint: 'Bulan 0 (Initial)', pullDate: new Date().toISOString().substring(0, 10), status: 'Completed', pHResult: 5.48, viscosityCps: 3450 },
          { timePoint: 'Bulan 1', pullDate: '2026-09-01', status: 'Scheduled' },
          { timePoint: 'Bulan 3', pullDate: '2026-11-01', status: 'Scheduled' },
        ],
      };
      setStabilityProtocols([local, ...stabilityProtocols]);
    }

    setShowNewStabilityModal(false);
    setNewStability({ ...newStability, productName: '', batchNumber: '' });
  };

  const handleCreateCoa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoa),
      });
      const json = await res.json();
      if (json.success && json.data) setCoaList([json.data, ...coaList]);
      else throw new Error();
    } catch (e) {
      const local: CoaDocument = {
        id: `COA-${Date.now()}`,
        coaNumber: `COA/2026/08/SRM-${Math.floor(100 + Math.random() * 900)}`,
        batchNumber: newCoa.batchNumber || 'BATCH-2026-SRM-088',
        productName: newCoa.productName || 'CosmoGlow Serum 30ml',
        productCode: 'FG-SRM-001',
        manufacturingDate: new Date().toISOString().substring(0, 10),
        expiryDate: '2028-08-10 (24 Bulan)',
        quantityProduced: '20,000 Pcs',
        clientName: newCoa.clientName,
        approvedByQA: newCoa.approvedByQA,
        digitalSignatureHash: `SHA256: ${Math.random().toString(36).substring(2, 15)}`,
        issueDate: new Date().toISOString().substring(0, 10),
        status: 'Issued & Approved',
        testResults: [
          { parameter: 'Pemerian / Appearance', method: 'Organoleptik', specification: 'Cairan jernih kental', result: 'Sesuai Spesifikasi' },
          { parameter: 'Derajat pH (25°C)', method: 'Potensiometri', specification: '5.20 - 5.80', result: '5.48' },
        ],
      };
      setCoaList([local, ...coaList]);
    }

    setShowNewCoaModal(false);
    setNewCoa({ ...newCoa, batchNumber: '', productName: '' });
  };

  const handleCreateDeviation = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newDeviation.title,
      severity: newDeviation.severity,
      batchNumber: newDeviation.batchNumber,
      department: newDeviation.department,
      correctiveAction: newDeviation.correctiveAction,
      preventiveAction: newDeviation.preventiveAction,
      rootCause5Why: [
        newDeviation.rootCause1 || 'Terjadi penyimpangan suhu pada tangki pembantu.',
        newDeviation.rootCause2 || 'Sensor thermostat butuh pembersihan berkala.',
        newDeviation.rootCause3 || 'Pembersihan filter ditambahkan ke jadwal PM.',
      ],
    };

    try {
      const res = await fetch('/api/capa/deviations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.data) setDeviations([json.data, ...deviations]);
      else throw new Error();
    } catch (e) {
      const local: QualityDeviationCapa = {
        id: `DEV-${Date.now()}`,
        caseNo: `DEV-2026-0815-${Math.floor(10 + Math.random() * 90)}`,
        type: 'Deviation',
        severity: newDeviation.severity,
        title: newDeviation.title,
        batchNumber: newDeviation.batchNumber || 'BATCH-2026-SRM-088',
        department: newDeviation.department,
        reportedDate: new Date().toISOString().substring(0, 10),
        rootCause5Why: payload.rootCause5Why,
        fishboneCategory: 'Machine',
        correctiveAction: newDeviation.correctiveAction || 'Verifikasi ulang kadar bahan aktif via HPLC.',
        preventiveAction: newDeviation.preventiveAction || 'Pembaruan SOP Maintenance Preventif.',
        targetClosureDate: '2026-08-25',
        status: 'CAPA Implemented',
        verifiedByQA: 'Eko Prasetyo, Apt.',
      };
      setDeviations([local, ...deviations]);
    }

    setShowNewDeviationModal(false);
    setNewDeviation({ ...newDeviation, title: '', batchNumber: '' });
  };

  const handleRunAiOosAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/quality/ai-analyze-oos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiOosInput),
      });
      const json = await res.json();
      if (json.success) setAiOosResult(json.analysis);
    } catch (e) {
      setAiOosResult({
        parameter: aiOosInput.parameter,
        specLimit: aiOosInput.specLimit,
        actualValue: aiOosInput.actualValue,
        batchNumber: aiOosInput.batchNumber,
        severity: 'High Risk - Out of Spec (OOS)',
        recommendation: 'Hentikan pengisian batch. Terbitkan Log Deviasi/NCR ke tim QA & lakukan uji homogenitas ulang.',
        cpkbClause: 'Klausal 8.0 CPKB BPOM RI - Penanganan Produk Tidak Sesuai (Non-Conformance)',
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleExecuteApiCall = async () => {
    setApiLoading(true);
    setApiResponse(null);
    try {
      const opts: RequestInit = {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
      };
      if (apiMethod === 'POST') opts.body = apiPayload;

      const res = await fetch(apiEndpoint, opts);
      const json = await res.json();
      setApiResponse(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setApiResponse(JSON.stringify({ error: e?.message || 'Failed to execute API request' }, null, 2));
    } finally {
      setApiLoading(false);
    }
  };

  const handleOpenCoaModal = (coa: CoaDocument) => {
    setSelectedCoa(coa);
    setShowCoaModal(true);
  };

  const filteredInspections = inspections.filter((i) => {
    const matchesFilter = inspectionFilter === 'All' || i.type === inspectionFilter;
    const matchesSearch =
      i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspectionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              onClick={() => setShowNewInspectionModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Inspeksi QC Baru</span>
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
          <p className="text-lg font-black font-mono text-amber-300">
            {inspections.filter((i) => i.status === 'QC Hold').length} Batch / Lot
          </p>
          <p className="text-[10px] text-amber-400 font-semibold">Gudang FEFO Blocked</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Inspeksi IQC Material</span>
            <Boxes className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">{inspections.length} Total IQC</p>
          <p className="text-[10px] text-emerald-400 font-semibold">AQL Standard Passed</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Sampel Lab LIMS</span>
            <FlaskConical className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">{labSamples.length} Samples</p>
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
          <p className="text-lg font-black font-mono text-purple-300">{stabilityProtocols.length} Active</p>
          <p className="text-[10px] text-slate-400">24 Months Shelf Life</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Penerbitan COA</span>
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">{coaList.length} Signed</p>
          <p className="text-[10px] text-slate-400">BPOM & Client Ready</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold custom-scrollbar scroll-smooth touch-pan-x pb-1"
      >
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

                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => handleToggleInspectionStatus(item.id, item.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block cursor-pointer transition-transform hover:scale-105 ${
                            item.status === 'Passed / Released'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                          title="Klik untuk mengubah status (Release <-> Hold)"
                        >
                          {item.status} ⇄
                        </button>
                        <p className="text-[10px] text-slate-400">Inspektur: {item.inspectorName}</p>
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
                <button
                  onClick={() => setShowNewInstrumentModal(true)}
                  className="text-[10px] font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-900"
                >
                  + Alat
                </button>
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

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari item / batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={inspectionFilter}
                onChange={(e) => setInspectionFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="All">Semua Tipe Inspeksi</option>
                <option value="IQC Raw Material">IQC Raw Material</option>
                <option value="IQC Packaging">IQC Packaging</option>
                <option value="IPQC Compounding">IPQC Compounding</option>
                <option value="FGQC Finished Goods">FGQC Finished Goods</option>
              </select>

              <button
                onClick={() => setShowNewInspectionModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Inspeksi Baru</span>
              </button>
            </div>
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
                    <th className="p-3">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredInspections.map((insp) => (
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
                          onClick={() => handleToggleInspectionStatus(insp.id, insp.status)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-purple-300 hover:bg-slate-800 text-[11px] font-bold"
                        >
                          Toggle Status ⇄
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
                <button
                  onClick={() => setShowNewInstrumentModal(true)}
                  className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold hover:bg-emerald-900"
                >
                  + Tambah Alat / Kalibrasi
                </button>
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
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Laboratorium Mikrobiologi & Environmental Monitoring</h2>
              <p className="text-xs text-slate-400">
                Pengujian Sterilitas, Angka Lempeng Total (ALT), Angka Kapang Khamir (AKBK), Pathogen Screening, Bioburden Purified Water WFI, & Swab Udara Cleanroom.
              </p>
            </div>

            <button
              onClick={() => setShowNewMicroModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Log Uji Mikrobiologi Baru</span>
            </button>
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
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Studi Stabilitas & Validasi Masa Simpan (Shelf Life)</h2>
              <p className="text-xs text-slate-400">
                Protokol Uji Stabilitas Dipercepat (Accelerated 40°C/75% RH) & Real-Time (30°C/65% RH), Penjadwalan Pulling Sampel, & Evaluasi Degradasi Formula.
              </p>
            </div>

            <button
              onClick={() => setShowNewStabilityModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Protokol Stabilitas Baru</span>
            </button>
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewCoaModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Terbitkan COA Baru</span>
              </button>
            </div>
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
              <h2 className="text-sm font-bold text-white">AI Quality Control & OOS Risk Analyzer Assistant</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Modul Inteligensi Buatan: Deteksi Anomali Viskositas/pH, Evaluasi Out of Specification (OOS), Recommendations AQL Sampling, & Proyeksi Stabilitas.
            </p>
          </div>

          {/* Interactive AI OOS Tool Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Analisa AI Out-Of-Specification (OOS) Risk Generator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Parameter Test</label>
                <input
                  type="text"
                  value={aiOosInput.parameter}
                  onChange={(e) => setAiOosInput({ ...aiOosInput, parameter: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Batas Spesifikasi Standard</label>
                <input
                  type="text"
                  value={aiOosInput.specLimit}
                  onChange={(e) => setAiOosInput({ ...aiOosInput, specLimit: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Hasil Pengujian Aktual</label>
                <input
                  type="text"
                  value={aiOosInput.actualValue}
                  onChange={(e) => setAiOosInput({ ...aiOosInput, actualValue: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Batch Number</label>
                <input
                  type="text"
                  value={aiOosInput.batchNumber}
                  onChange={(e) => setAiOosInput({ ...aiOosInput, batchNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunAiOosAnalysis}
                disabled={aiLoading}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>{aiLoading ? 'Menganalisa OOS...' : 'Jalankan Analisa AI OOS'}</span>
              </button>
            </div>

            {aiOosResult && (
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300 font-bold">Hasil Evaluasi AI Quality Intelligence</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] border border-rose-500/40">
                    {aiOosResult.severity}
                  </span>
                </div>
                <p className="text-white font-bold">Rekomendasi Tindakan Mutu:</p>
                <p className="text-slate-300">{aiOosResult.recommendation}</p>
                <p className="text-[10px] text-cyan-300 border-t border-slate-800 pt-1">
                  Acuan Regulasi: {aiOosResult.cpkbClause}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 10: DB ENTITIES & REST API */}
      {activeTab === 'api_schema' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Database Schema Entities & Live REST API Playground (Prompt 14)</h2>
            <p className="text-xs text-slate-400">
              Uji Endpoint REST API Backend Quality Control & LIMS secara langsung dari aplikasi.
            </p>
          </div>

          {/* Interactive REST API Playground */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Live REST API Playground & Tester
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-xs">
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>

              <select
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="/api/quality/inspections">GET/POST /api/quality/inspections</option>
                <option value="/api/lims/samples">GET/POST /api/lims/samples</option>
                <option value="/api/lims/instruments">GET/POST /api/lims/instruments</option>
                <option value="/api/microbiology/tests">GET/POST /api/microbiology/tests</option>
                <option value="/api/stability/protocols">GET/POST /api/stability/protocols</option>
                <option value="/api/coa/documents">GET/POST /api/coa/documents</option>
                <option value="/api/capa/deviations">GET/POST /api/capa/deviations</option>
              </select>

              <button
                onClick={handleExecuteApiCall}
                disabled={apiLoading}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs whitespace-nowrap"
              >
                {apiLoading ? 'Testing...' : 'Kirim Request'}
              </button>
            </div>

            {apiMethod === 'POST' && (
              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-400 block text-[10px]">JSON Request Payload:</label>
                <textarea
                  rows={4}
                  value={apiPayload}
                  onChange={(e) => setApiPayload(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-300 focus:outline-none font-mono text-xs"
                />
              </div>
            )}

            {apiResponse && (
              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-400 block text-[10px]">Server Response JSON:</label>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 overflow-x-auto text-xs max-h-60">
                  {apiResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: CERTIFICATE OF ANALYSIS (COA) PDF */}
      {/* ========================================== */}
      {showCoaModal && selectedCoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl space-y-6 my-8">
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

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowCoaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW INSPECTION */}
      {showNewInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Formulir Inspeksi Mutu Baru</h3>
              <button onClick={() => setShowNewInspectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Tipe Inspeksi</label>
                <select
                  value={newInspection.type}
                  onChange={(e) => setNewInspection({ ...newInspection, type: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="IQC Raw Material">IQC Raw Material</option>
                  <option value="IQC Packaging">IQC Packaging</option>
                  <option value="IPQC Compounding">IPQC Compounding</option>
                  <option value="FGQC Finished Goods">FGQC Finished Goods</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Barang / Produk</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salicylic Acid / CosmoGlow Serum"
                  value={newInspection.itemName}
                  onChange={(e) => setNewInspection({ ...newInspection, itemName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Nomor Batch / Lot</label>
                  <input
                    type="text"
                    required
                    placeholder="BATCH-2026-SRM-099"
                    value={newInspection.batchNumber}
                    onChange={(e) => setNewInspection({ ...newInspection, batchNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Pemasok / Line</label>
                  <input
                    type="text"
                    placeholder="DSM / Line Cleanroom A"
                    value={newInspection.supplierOrLine}
                    onChange={(e) => setNewInspection({ ...newInspection, supplierOrLine: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Param 1 Result</label>
                  <input
                    type="text"
                    value={newInspection.param1Result}
                    onChange={(e) => setNewInspection({ ...newInspection, param1Result: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Param 2 Result</label>
                  <input
                    type="text"
                    value={newInspection.param2Result}
                    onChange={(e) => setNewInspection({ ...newInspection, param2Result: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInspectionModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-xs font-bold text-white hover:bg-purple-500"
                >
                  Simpan Inspeksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW LAB SAMPLE */}
      {showNewSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Registrasi Sampel Uji LIMS Baru</h3>
              <button onClick={() => setShowNewSampleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Barang / Material</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salicylic Acid 99% / Serum Bulk"
                  value={newSample.itemName}
                  onChange={(e) => setNewSample({ ...newSample, itemName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nomor Batch / Lot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BATCH-2026-SRM-089"
                  value={newSample.batchNumber}
                  onChange={(e) => setNewSample({ ...newSample, batchNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Kategori Pengujian LIMS</label>
                <select
                  value={newSample.testCategory}
                  onChange={(e) => setNewSample({ ...newSample, testCategory: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Chemical & Physical">Chemical & Physical</option>
                  <option value="Microbiology">Microbiology (ALT/AKBK)</option>
                  <option value="Heavy Metal">Heavy Metal Spectrometry</option>
                  <option value="Assay Active">Assay Active HPLC</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewSampleModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500"
                >
                  Simpan Sampel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG INSTRUMENT CALIBRATION */}
      {showNewInstrumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Log Kalibrasi Alat Lab Baru</h3>
              <button onClick={() => setShowNewInstrumentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInstrument} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Alat / Instrumen</label>
                <input
                  type="text"
                  required
                  placeholder="Benchtop pH Meter / Refractometer"
                  value={newInstrument.equipmentName}
                  onChange={(e) => setNewInstrument({ ...newInstrument, equipmentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Kode Peralatan</label>
                  <input
                    type="text"
                    placeholder="LAB-EQ-09"
                    value={newInstrument.equipmentCode}
                    onChange={(e) => setNewInstrument({ ...newInstrument, equipmentCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Brand & Model</label>
                  <input
                    type="text"
                    placeholder="Mettler Toledo S400"
                    value={newInstrument.brandModel}
                    onChange={(e) => setNewInstrument({ ...newInstrument, brandModel: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInstrumentModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Simpan Kalibrasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: NEW MICROBIOLOGY TEST */}
      {showNewMicroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-emerald-300">Log Uji Mikrobiologi Baru</h3>
              <button onClick={() => setShowNewMicroModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMicro} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Sampel / Swab</label>
                <input
                  type="text"
                  required
                  placeholder="Cleanroom Swab / Serum Bulk"
                  value={newMicro.sampleName}
                  onChange={(e) => setNewMicro({ ...newMicro, sampleName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Hasil Pengamatan CFU</label>
                <input
                  type="text"
                  value={newMicro.actualResult}
                  onChange={(e) => setNewMicro({ ...newMicro, actualResult: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewMicroModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Simpan Uji Micro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW STABILITY PROTOCOL */}
      {showNewStabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-300">Protokol Uji Stabilitas Baru</h3>
              <button onClick={() => setShowNewStabilityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStability} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Barrier Defense Cream 50g"
                  value={newStability.productName}
                  onChange={(e) => setNewStability({ ...newStability, productName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  placeholder="BATCH-2026-CRM-010"
                  value={newStability.batchNumber}
                  onChange={(e) => setNewStability({ ...newStability, batchNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewStabilityModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white hover:bg-amber-500"
                >
                  Simpan Protokol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: GENERATE NEW COA */}
      {showNewCoaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-teal-300">Terbitkan Certificate of Analysis (COA)</h3>
              <button onClick={() => setShowNewCoaModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoa} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Batch Number Produk</label>
                <input
                  type="text"
                  required
                  placeholder="BATCH-2026-SRM-088"
                  value={newCoa.batchNumber}
                  onChange={(e) => setNewCoa({ ...newCoa, batchNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="CosmoGlow Brightening Serum 30ml"
                  value={newCoa.productName}
                  onChange={(e) => setNewCoa({ ...newCoa, productName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewCoaModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-xs font-bold text-white hover:bg-teal-500"
                >
                  Terbitkan COA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: NEW DEVIATION LOG */}
      {showNewDeviationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-rose-300">Log Penyimpangan (Deviation / NCR) Baru</h3>
              <button onClick={() => setShowNewDeviationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeviation} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Judul Deviasi Mutu</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suhu Compounding Melebihi Toleransi"
                  value={newDeviation.title}
                  onChange={(e) => setNewDeviation({ ...newDeviation, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Tingkat Keparahan</label>
                  <select
                    value={newDeviation.severity}
                    onChange={(e) => setNewDeviation({ ...newDeviation, severity: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block text-[10px] mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="BATCH-2026-SRM-088"
                    value={newDeviation.batchNumber}
                    onChange={(e) => setNewDeviation({ ...newDeviation, batchNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] mb-1">Tindakan Korektif (Corrective Action)</label>
                <textarea
                  rows={2}
                  value={newDeviation.correctiveAction}
                  onChange={(e) => setNewDeviation({ ...newDeviation, correctiveAction: e.target.value })}
                  placeholder="Tindakan penanganan langsung..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewDeviationModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white hover:bg-rose-500"
                >
                  Kirim Laporan QA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
