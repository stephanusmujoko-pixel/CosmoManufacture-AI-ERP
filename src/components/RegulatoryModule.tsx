import React, { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
  Search,
  Sparkles,
  Printer,
  FileCheck2,
  Plus,
  X,
  Filter,
  CheckSquare,
  Building2,
  Tag,
  FlaskConical,
  Calendar,
  Flame,
  BookOpen,
  Cpu,
  Layers,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
  HelpCircle,
  Check,
  QrCode,
  Lock,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { BpomSubmission, CpkbAuditItem, QualityControlCheck } from '../types';
import { MOCK_BPOM_SUBMISSIONS, MOCK_CPKB_AUDIT, MOCK_QC_CHECKS } from '../data/mockErpData';

// Regulated ingredients database (PerBPOM No. 23/2019 & ASEAN Cosmetic Directive)
interface RegulatedIngredient {
  inciName: string;
  casNumber: string;
  category: 'Restricted' | 'Prohibited' | 'Preservative' | 'UV Filter' | 'Colorant';
  maxAllowedPctLeaveOn: number;
  maxAllowedPctRinseOff: number;
  mandatoryWarning: string;
  bpomRegulationRef: string;
}

const REGULATED_INGREDIENTS_DB: RegulatedIngredient[] = [
  {
    inciName: 'Niacinamide (Vitamin B3)',
    casNumber: '98-92-0',
    category: 'Restricted',
    maxAllowedPctLeaveOn: 10.0,
    maxAllowedPctRinseOff: 15.0,
    mandatoryWarning: 'Hindari kontak langsung dengan mata. Jika timbul iritasi, kurangi frekuensi pemakaian.',
    bpomRegulationRef: 'PerBPOM No. 23 Tahun 2019 - Lampiran II (Batas Kadar Kosmetik)',
  },
  {
    inciName: 'Salicylic Acid (Beta Hydroxy Acid)',
    casNumber: '69-72-7',
    category: 'Restricted',
    maxAllowedPctLeaveOn: 2.0,
    maxAllowedPctRinseOff: 3.0,
    mandatoryWarning: 'Tidak digunakan untuk anak di bawah usia 3 tahun. Jangan digunakan pada kulit yang terkelupas atau iritasi.',
    bpomRegulationRef: 'PerBPOM No. 23 Tahun 2019 - Lampiran IV (Bahan Yang Dibatasi)',
  },
  {
    inciName: 'Hydroquinone',
    casNumber: '123-31-9',
    category: 'Prohibited',
    maxAllowedPctLeaveOn: 0.0,
    maxAllowedPctRinseOff: 0.0,
    mandatoryWarning: 'DILARANG TOTAL DALAM KOSMETIK (Hanya untuk obat keras dengan resep dokter).',
    bpomRegulationRef: 'PerBPOM No. 23 Tahun 2019 - Lampiran I (Bahan Dilarang)',
  },
  {
    inciName: 'Phenoxyethanol',
    casNumber: '122-99-6',
    category: 'Preservative',
    maxAllowedPctLeaveOn: 1.0,
    maxAllowedPctRinseOff: 1.0,
    mandatoryWarning: 'Batas maksimum pengawet 1.0% dalam sediaan kosmetik.',
    bpomRegulationRef: 'PerBPOM No. 23 Tahun 2019 - Lampiran V (Pengawet Terdaftar)',
  },
  {
    inciName: 'Alpha Arbutin',
    casNumber: '84380-01-8',
    category: 'Restricted',
    maxAllowedPctLeaveOn: 2.0,
    maxAllowedPctRinseOff: 4.0,
    mandatoryWarning: 'Dapat menyebabkan sensitivitas cahaya. Gunakan tabir surya pada siang hari.',
    bpomRegulationRef: 'ASEAN Cosmetic Directive - Annex III Part 1',
  },
  {
    inciName: 'Titanium Dioxide (Nano / Micro)',
    casNumber: '13463-67-7',
    category: 'UV Filter',
    maxAllowedPctLeaveOn: 25.0,
    maxAllowedPctRinseOff: 25.0,
    mandatoryWarning: 'Hindari terhirup langsung pada sediaan spray / aerosol.',
    bpomRegulationRef: 'PerBPOM No. 23 Tahun 2019 - Lampiran VI (Tabir Surya)',
  },
  {
    inciName: 'Retinol (Pure Vitamin A)',
    casNumber: '68-26-8',
    category: 'Restricted',
    maxAllowedPctLeaveOn: 1.0,
    maxAllowedPctRinseOff: 1.0,
    mandatoryWarning: 'Tidak direkomendasikan untuk ibu hamil dan menyusui. Wajib menggunakan sunscreen pada pagi hari.',
    bpomRegulationRef: 'Pedoman Evaluasi Keamanan Bahan Kosmetik BPOM RI',
  },
];

export const RegulatoryModule: React.FC = () => {
  const [bpomList, setBpomList] = useState<BpomSubmission[]>(MOCK_BPOM_SUBMISSIONS);
  const [cpkbList, setCpkbList] = useState<CpkbAuditItem[]>(MOCK_CPKB_AUDIT);
  const [activeTab, setActiveTab] = useState<'bpom' | 'cpkb' | 'coa_msds' | 'ingredient_checker' | 'ai_assistant'>('bpom');
  const [selectedBpom, setSelectedBpom] = useState<BpomSubmission>(bpomList[0]);

  // Filters & Searches
  const [bpomSearch, setBpomSearch] = useState('');
  const [bpomStatusFilter, setBpomStatusFilter] = useState<string>('all');
  const [cpkbCategoryFilter, setCpkbCategoryFilter] = useState<string>('all');
  const [cpkbStatusFilter, setCpkbStatusFilter] = useState<string>('all');

  // Active DIP / PIF Part Tab
  const [activePifPart, setActivePifPart] = useState<'part1' | 'part2' | 'part3' | 'part4'>('part1');

  // Modals
  const [showAddBpomModal, setShowAddBpomModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAddCpkbModal, setShowAddCpkbModal] = useState(false);

  // Form state for New BPOM Submission
  const [newBpom, setNewBpom] = useState({
    productName: '',
    brandName: '',
    formulaCode: '',
    category: 'Skincare - Facial Serum',
    applicantCompany: 'PT Paragonia Cosmetic Industri',
    registrationNumber: 'DRAFT-BPOM-2026',
  });

  // Form state for New CPKB Audit Finding
  const [newCpkb, setNewCpkb] = useState({
    clause: 'Klausal 4.2',
    title: 'Kebersihan Air Shower & HEPA Filter Room Class D',
    category: 'sanitation' as 'sanitation' | 'equipment' | 'personnel' | 'production' | 'quality' | 'documentation',
    status: 'compliant' as 'compliant' | 'minor_nc' | 'major_nc' | 'critical_nc',
    evidence: 'Verifikasi pembersihan rutin dan pergantian filter HEPA ruang penimbangan.',
    correctiveAction: '',
  });

  // COA / MSDS generator state
  const [subTabCoaMsds, setSubTabCoaMsds] = useState<'coa' | 'msds' | 'halal'>('coa');
  const [selectedBatchForCoa, setSelectedBatchForCoa] = useState('LOT-PAR-2026-0801');

  // Ingredient Checker State
  const [checkerInci, setCheckerInci] = useState(REGULATED_INGREDIENTS_DB[0].inciName);
  const [checkerProductType, setCheckerProductType] = useState<'leave_on' | 'rinse_off'>('leave_on');
  const [checkerConcentration, setCheckerConcentration] = useState<number>(5.0);

  // AI Assistant Chat State
  const [aiPrompts, setAiPrompts] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: 'Halo! Saya Asisten Regulasi BPOM & CPKB ISO 22716. Silakan tanyakan hal seputar notifikasi e-BPOM NA, penyusunan berkas DIP/PIF 4-Part, audit internal CPKB, atau pendaftaran Halal BPJPH/MUI.',
      time: '09:00',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  // Filtering BPOM Submissions
  const filteredBpomList = bpomList.filter((b) => {
    const matchSearch =
      b.productName.toLowerCase().includes(bpomSearch.toLowerCase()) ||
      b.brandName.toLowerCase().includes(bpomSearch.toLowerCase()) ||
      b.registrationNumber.toLowerCase().includes(bpomSearch.toLowerCase());
    const matchStatus = bpomStatusFilter === 'all' || b.status === bpomStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtering CPKB Checklist Items
  const filteredCpkbList = cpkbList.filter((c) => {
    const matchCategory = cpkbCategoryFilter === 'all' || c.category === cpkbCategoryFilter;
    const matchStatus = cpkbStatusFilter === 'all' || c.status === cpkbStatusFilter;
    return matchCategory && matchStatus;
  });

  // Handlers & API integration
  useEffect(() => {
    const fetchRegulatoryData = async () => {
      try {
        const [bpomRes, cpkbRes] = await Promise.all([
          fetch('/api/regulatory/bpom'),
          fetch('/api/regulatory/cpkb'),
        ]);
        if (bpomRes.ok) {
          const bpomData = await bpomRes.json();
          if (bpomData.data && bpomData.data.length > 0) {
            setBpomList(bpomData.data);
            setSelectedBpom(bpomData.data[0]);
          }
        }
        if (cpkbRes.ok) {
          const cpkbData = await cpkbRes.json();
          if (cpkbData.data && cpkbData.data.length > 0) {
            setCpkbList(cpkbData.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch regulatory data:', err);
      }
    };
    fetchRegulatoryData();
  }, []);

  const handleCreateBpom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/regulatory/bpom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBpom),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBpomList([data.data, ...bpomList]);
        setSelectedBpom(data.data);
        setShowAddBpomModal(false);
        setNewBpom({
          productName: '',
          brandName: '',
          formulaCode: '',
          category: 'Skincare - Facial Serum',
          applicantCompany: 'PT Paragonia Cosmetic Industri',
          registrationNumber: 'DRAFT-BPOM-2026',
        });
      }
    } catch (err) {
      console.error('Failed to create BPOM submission:', err);
    }
  };

  const handleUpdateStatusBpom = (newStatus: BpomSubmission['status']) => {
    const updated = bpomList.map((b) => (b.id === selectedBpom.id ? { ...b, status: newStatus } : b));
    setBpomList(updated);
    setSelectedBpom({ ...selectedBpom, status: newStatus });
    setShowUpdateStatusModal(false);
  };

  const handleCreateCpkb = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/regulatory/cpkb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCpkb),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCpkbList([data.data, ...cpkbList]);
        setShowAddCpkbModal(false);
        setNewCpkb({
          clause: 'Klausal 4.2',
          title: 'Kebersihan Air Shower & HEPA Filter Room Class D',
          category: 'sanitation',
          status: 'compliant',
          evidence: 'Verifikasi pembersihan rutin dan pergantian filter HEPA ruang penimbangan.',
          correctiveAction: '',
        });
      }
    } catch (err) {
      console.error('Failed to create CPKB finding:', err);
    }
  };

  const handleResolveCpkbStatus = (id: string) => {
    setCpkbList(
      cpkbList.map((item) =>
        item.id === id ? { ...item, status: 'compliant', correctiveAction: 'Lulus Verifikasi Ulang Audit' } : item
      )
    );
  };

  const handleSendAiQuestion = (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim()) return;

    const userMsg = { role: 'user' as const, text: q, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setAiPrompts((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');

    setTimeout(() => {
      let answer = 'Berdasarkan PerBPOM No. 23 Tahun 2019 dan pedoman e-BPOM kosmetik:';
      if (q.toLowerCase().includes('sunscreen') || q.toLowerCase().includes('spf')) {
        answer = 'Untuk pendaftaran e-BPOM NA sediaan Sunscreen (SPF): Wajib melampirkan Laporan Uji In-Vitro / In-Vivo Nilai SPF dari laboratorium terakreditasi ISO 17025, Sertifikat PA (Broad Spectrum), serta pengujian kadar bahan aktif UV filter (misal Titanium Dioxide / Zinc Oxide) sesuai batas maksimum 25%.';
      } else if (q.toLowerCase().includes('salicylic') || q.toLowerCase().includes('bha')) {
        answer = 'Salicylic Acid dibatasi maksimal 2.0% pada produk leave-on (serum/toner) dan 3.0% pada produk rinse-off (cleanser). Wajib mencantumkan peringatan label: "Tidak digunakan untuk anak di bawah usia 3 tahun" pada kemasan sekunder.';
      } else if (q.toLowerCase().includes('dip') || q.toLowerCase().includes('pif')) {
        answer = 'Dokumen Informasi Produk (DIP/PIF) terdiri dari 4 Bagian Utama: Bagian I (Administratif & Ringkasan Produk), Bagian II (Data Mutu Bahan Baku), Bagian III (Data Mutu Produk Jadi & Uji Stabilitas), dan Bagian IV (Laporan Penilaian Keamanan oleh Safety Assessor Bersertifikat). DIP wajib disimpan selama 6 tahun sejak batch produksi terakhir.';
      } else if (q.toLowerCase().includes('halal') || q.toLowerCase().includes('bpjph')) {
        answer = 'Pendaftaran Sertifikasi Halal Kosmetik melalui BPJPH / LPPOM MUI mengacu pada HAS 23000. Persyaratan utama meliputi: Matriks Bahan Baku Halal, Sertifikat Halal produsen bahan aktif/pengawet, Prosedur Pembersihan Lini Produksi Cleanroom (Pork-Free Line Verification), dan Pembentukan Tim Manajemen Halal Perusahaan.';
      } else {
        answer = `Pertanyaan Anda mengenai "${q}" telah dianalisis sesuai Regulasi Kosmetik BPOM RI. Pastikan berkas DIP Part I-IV lengkap, nomor lot bahan baku terlacak FEFO, dan fasilitas cleanroom memenuhi klausal ISO 22716.`;
      }

      setAiPrompts((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: answer,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  // Selected Ingredient for Checker
  const selectedRegulatedItem =
    REGULATED_INGREDIENTS_DB.find((i) => i.inciName === checkerInci) || REGULATED_INGREDIENTS_DB[0];

  const maxAllowedForType =
    checkerProductType === 'leave_on'
      ? selectedRegulatedItem.maxAllowedPctLeaveOn
      : selectedRegulatedItem.maxAllowedPctRinseOff;

  const isProhibited = selectedRegulatedItem.category === 'Prohibited';
  const isExceeded = !isProhibited && checkerConcentration > maxAllowedForType;
  const isCompliant = !isProhibited && !isExceeded;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
              <Award className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Regulatory Compliance, e-BPOM NA & CPKB ISO 22716
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pendaftaran Notifikasi BPOM (NA Number), Manajemen Dokumen Informasi Produk (DIP/PIF 4-Part), Audit CPKB ISO 22716, Penerbitan COA/MSDS & Sertifikat Halal BPJPH.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddBpomModal(true)}
            className="rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Registrasi BPOM NA
          </button>
          <span className="rounded-full bg-amber-950 px-3 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            BPOM Industry Class A Certified
          </span>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-md">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center">
            <span>BPOM Active NA</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {bpomList.filter((b) => b.status === 'approved').length} / {bpomList.length}
          </div>
          <div className="text-[10px] text-emerald-400 font-bold">100% Valid & Certified</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-md">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center">
            <span>In Evaluasi BPOM</span>
            <RefreshCw className="h-4 w-4 text-amber-400 animate-spin" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">
            {bpomList.filter((b) => b.status === 'submitted' || b.status === 'under_evaluation').length} SKU
          </div>
          <div className="text-[10px] text-slate-400">Target Rilis NA ≤ 14 Hari</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-md">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center">
            <span>CPKB Compliance</span>
            <Award className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300 font-mono">96.8%</div>
          <div className="text-[10px] text-indigo-400 font-bold">ISO 22716 Cleanroom Gol A</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-md">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center">
            <span>Audit Halal BPJPH</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300 font-mono">HAS 23000</div>
          <div className="text-[10px] text-emerald-400 font-bold">A - Excellent Compliance</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto custom-scrollbar scroll-smooth touch-pan-x py-1"
      >
        <button
          onClick={() => setActiveTab('bpom')}
          className={`pb-3 px-5 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'bpom'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-3.5 w-3.5" /> e-BPOM NA Portal & DIP Dossier
        </button>
        <button
          onClick={() => setActiveTab('cpkb')}
          className={`pb-3 px-5 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'cpkb'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" /> Checklist Audit CPKB ISO 22716
        </button>
        <button
          onClick={() => setActiveTab('coa_msds')}
          className={`pb-3 px-5 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'coa_msds'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Printer className="h-3.5 w-3.5" /> COA, MSDS 16-GHS & Halal
        </button>
        <button
          onClick={() => setActiveTab('ingredient_checker')}
          className={`pb-3 px-5 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ingredient_checker'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" /> Regulatory Limit Checker INCI
        </button>
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`pb-3 px-5 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ai_assistant'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI Regulatory Copilot
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BPOM NA REGISTRATION PORTAL & DIP DOSSIER */}
      {/* ========================================================================= */}
      {activeTab === 'bpom' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari produk, brand, atau nomor BPOM NA..."
                value={bpomSearch}
                onChange={(e) => setBpomSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={bpomStatusFilter}
                onChange={(e) => setBpomStatusFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 p-2 text-slate-200 font-bold"
              >
                <option value="all">Semua Status Notifikasi</option>
                <option value="approved">Approved (NA Issued)</option>
                <option value="submitted">Submitted / Evaluation</option>
                <option value="under_evaluation">Under Evaluation</option>
                <option value="revision_requested">Revisi Berkas</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                <span>Daftar Notifikasi BPOM ({filteredBpomList.length})</span>
                <span className="text-[10px] text-amber-400 font-normal">Klik untuk lihat DIP</span>
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredBpomList.map((bpom) => (
                  <div
                    key={bpom.id}
                    onClick={() => setSelectedBpom(bpom)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      selectedBpom.id === bpom.id
                        ? 'border-amber-500 bg-gradient-to-r from-slate-900 to-amber-950/60 shadow-lg ring-1 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {bpom.registrationNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          bpom.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : bpom.status === 'revision_requested'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {bpom.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-slate-100">{bpom.productName}</h4>
                    <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                      <span>Brand: <strong className="text-slate-200">{bpom.brandName}</strong></span>
                      <span className="font-mono">{bpom.submissionDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Submission Detail & DIP Dossier */}
            <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                      {selectedBpom.registrationNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Formula: {selectedBpom.formulaCode}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">{selectedBpom.productName}</h3>
                  <p className="text-xs text-slate-400">Pemohon / Pendaftar: {selectedBpom.applicantCompany}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowUpdateStatusModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Edit className="h-3.5 w-3.5 text-amber-400" /> Update Status
                  </button>
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md"
                  >
                    <QrCode className="h-3.5 w-3.5" /> Sertifikat e-BPOM
                  </button>
                </div>
              </div>

              {/* Dossier Header Info */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Kategori Sediaan</span>
                  <span className="font-bold text-slate-200">{selectedBpom.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Tgl Pengajuan e-BPOM</span>
                  <span className="font-bold text-slate-200">{selectedBpom.submissionDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Masa Berlaku NA</span>
                  <span className="font-bold text-emerald-400">{selectedBpom.validUntil || '2030-12-31'}</span>
                </div>
              </div>

              {/* DIP / PIF (Product Information File) 4-Part Tabs */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-amber-400" /> Berkas Dokumen Informasi Produk (DIP / PIF Dossier)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Kepatuhan PerBPOM No. 23/2019
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px] font-bold">
                  <button
                    onClick={() => setActivePifPart('part1')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePifPart === 'part1'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    BAGIAN I<br /><span className="text-[9px] font-normal">Administrasi & Ringkasan</span>
                  </button>
                  <button
                    onClick={() => setActivePifPart('part2')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePifPart === 'part2'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    BAGIAN II<br /><span className="text-[9px] font-normal">Mutu Bahan Baku (COA/MSDS)</span>
                  </button>
                  <button
                    onClick={() => setActivePifPart('part3')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePifPart === 'part3'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    BAGIAN III<br /><span className="text-[9px] font-normal">Mutu Produk & Stabilitas</span>
                  </button>
                  <button
                    onClick={() => setActivePifPart('part4')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePifPart === 'part4'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    BAGIAN IV<br /><span className="text-[9px] font-normal">Penilaian Keamanan (Safety)</span>
                  </button>
                </div>

                {/* PIF Content Viewer */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                  {activePifPart === 'part1' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                        <span className="font-bold text-amber-300">DIP Part I: Administratif & Ringkasan Produk</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Verified BPOM Auditor</span>
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">1. Suratedikasi Izin Edar & Izin Produksi CPKB Golongan A</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">2. Surat Pernyataan Direksi & Apoteker Penanggung Jawab (APJ)</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">3. Proof Desain Kemasan Sekunder & Labeling Kepatuhan Klaim</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePifPart === 'part2' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                        <span className="font-bold text-amber-300">DIP Part II: Data Mutu Bahan Baku (Raw Material Quality)</span>
                        <span className="text-[10px] text-emerald-400 font-mono">FEFO & COA Matched</span>
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">1. Spesifikasi INCI & CAS Number Seluruh Komposisi Formulasi</span>
                          <span className="text-emerald-400 font-bold">PASS</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">2. COA (Certificate of Analysis) Pemasok Terverifikasi AVL</span>
                          <span className="text-emerald-400 font-bold">PASS</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">3. MSDS GHS 16-Section & Sertifikat Bebas Logam Berat</span>
                          <span className="text-emerald-400 font-bold">PASS</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePifPart === 'part3' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                        <span className="font-bold text-amber-300">DIP Part III: Data Mutu Produk Jadi & Uji Stabilitas</span>
                        <span className="text-[10px] text-emerald-400 font-mono">3-Month Accelerated Pass</span>
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">1. Dokumen Rekam Batch (Batch Production Record) MES</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">2. Laporan Uji Stabilitas Dipercepat (40°C / 75% RH - 3 Bulan)</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">3. Laporan Uji Tantangan Pengawet (Preservative Challenge Test)</span>
                          <span className="text-emerald-400 font-bold">LENGKAP</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePifPart === 'part4' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                        <span className="font-bold text-amber-300">DIP Part IV: Laporan Penilaian Keamanan Kosmetik</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Safety Assessor Signed</span>
                      </div>
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">1. Laporan Kaji Ulang Keamanan oleh Safety Assessor Bersertifikat</span>
                          <span className="text-emerald-400 font-bold">APPROVED</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">2. Kalkulasi Margin of Safety (MoS &gt; 100) Seluruh Ingredients</span>
                          <span className="text-emerald-400 font-bold">PASSED (MoS 240)</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-200">3. Sertifikat Dermatologically Tested & Non-Comedogenic Proof</span>
                          <span className="text-emerald-400 font-bold">APPROVED</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CPKB ISO 22716 CHECKLIST AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'cpkb' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-amber-400" /> Filter Audit CPKB:
              </span>
              <select
                value={cpkbCategoryFilter}
                onChange={(e) => setCpkbCategoryFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 p-2 text-slate-200 font-bold"
              >
                <option value="all">Semua Kategori CPKB</option>
                <option value="sanitation">Sanitasi & Higiene</option>
                <option value="equipment">Peralatan Cleanroom</option>
                <option value="personnel">Personel & APD</option>
                <option value="production">Proses Produksi</option>
                <option value="quality">Pengawasan Mutu QC</option>
                <option value="documentation">Dokumentasi & Rekam Batch</option>
              </select>

              <select
                value={cpkbStatusFilter}
                onChange={(e) => setCpkbStatusFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 p-2 text-slate-200 font-bold"
              >
                <option value="all">Semua Status Audit</option>
                <option value="compliant">Compliant (Sesuai)</option>
                <option value="minor_nc">Minor NC</option>
                <option value="major_nc">Major NC</option>
                <option value="critical_nc">Critical NC</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddCpkbModal(true)}
              className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" /> Tambah Temuan Audit CPKB
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white">
                Matrix Kepatuhan Standar CPKB (Cara Pembuatan Kosmetika yang Baik) & ISO 22716
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Fasilitas: PT Paragonia Cleanroom Unit #01
              </span>
            </div>

            <div className="space-y-3">
              {filteredCpkbList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-400 font-mono text-sm">{item.clause}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'compliant'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'minor_nc'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30 animate-pulse'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>

                      {item.status !== 'compliant' && (
                        <button
                          onClick={() => handleResolveCpkbStatus(item.id)}
                          className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold transition-all"
                        >
                          Tandai Selesai CAPA
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                  <p className="text-slate-300 leading-relaxed">{item.evidence}</p>

                  {item.correctiveAction && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Tindakan Perbaikan (CAPA):</strong> {item.correctiveAction}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GENERATOR COA, MSDS 16-SECTION & HALAL BPJPH */}
      {/* ========================================================================= */}
      {activeTab === 'coa_msds' && (
        <div className="space-y-4">
          {/* Sub-tab selection */}
          <div className="flex justify-center border-b border-slate-800 pb-3 gap-3 text-xs font-bold">
            <button
              onClick={() => setSubTabCoaMsds('coa')}
              className={`px-4 py-2 rounded-xl transition-all ${
                subTabCoaMsds === 'coa'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Sertifikat Analisis (COA)
            </button>
            <button
              onClick={() => setSubTabCoaMsds('msds')}
              className={`px-4 py-2 rounded-xl transition-all ${
                subTabCoaMsds === 'msds'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Lembar Keselamatan (MSDS 16-GHS)
            </button>
            <button
              onClick={() => setSubTabCoaMsds('halal')}
              className={`px-4 py-2 rounded-xl transition-all ${
                subTabCoaMsds === 'halal'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Audit Halal BPJPH / HAS 23000
            </button>
          </div>

          {subTabCoaMsds === 'coa' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl max-w-3xl mx-auto space-y-6 text-slate-200">
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-300">Pilih Batch Produksi untuk COA:</span>
                <select
                  value={selectedBatchForCoa}
                  onChange={(e) => setSelectedBatchForCoa(e.target.value)}
                  className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-1 font-mono text-amber-300 font-bold"
                >
                  <option value="LOT-PAR-2026-0801">LOT-PAR-2026-0801 (Luminance Glow Serum)</option>
                  <option value="LOT-PAR-2026-0802">LOT-PAR-2026-0802 (Barrier Hydrating Gel)</option>
                  <option value="LOT-SER-2026-0715">LOT-SER-2026-0715 (Gentle Cleanser Foam)</option>
                </select>
              </div>

              <div className="text-center space-y-1 pb-4 border-b border-slate-800">
                <h2 className="text-xl font-black text-white tracking-wide">
                  CERTIFICATE OF ANALYSIS (COA)
                </h2>
                <p className="text-xs font-semibold text-emerald-400">
                  PT PARAGONIA COSMETIC INDUSTRI • PABRIK MAKLON KOSMETIK
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Sertifikat Rilis Mutu Resmi Sesuai Standar BPOM & ISO 22716
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nama Produk</span>
                  <span className="font-bold text-amber-300">
                    {selectedBatchForCoa === 'LOT-PAR-2026-0801'
                      ? 'Luminance Glow Serum 10% Niacinamide'
                      : selectedBatchForCoa === 'LOT-PAR-2026-0802'
                      ? 'Barrier Hydrating Gel Cream'
                      : 'Gentle Amino Acid Cleanser Foam'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor Lot / Batch</span>
                  <span className="font-bold text-slate-200">{selectedBatchForCoa}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor Notifikasi BPOM</span>
                  <span className="font-bold text-emerald-400">NA18240199882</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tanggal Rilis Lab</span>
                  <span className="font-bold text-slate-200">08 Agustus 2026</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="p-3">Parameter Uji Lab</th>
                      <th className="p-3">Spesifikasi Standar</th>
                      <th className="p-3">Hasil Pengujian</th>
                      <th className="p-3">Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    <tr>
                      <td className="p-3">Pemeriksaan Organoleptik</td>
                      <td className="p-3">Cairan jernih kental, bau khas centella</td>
                      <td className="p-3 text-slate-100">Sesuai Standar</td>
                      <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-3">Nilai pH (25°C)</td>
                      <td className="p-3">5.0 - 5.5</td>
                      <td className="p-3 text-emerald-300 font-bold">5.24</td>
                      <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-3">Viskositas cPs (RVT Sp3 20RPM)</td>
                      <td className="p-3">3,500 - 5,000 cPs</td>
                      <td className="p-3 text-emerald-300 font-bold">4,200 cPs</td>
                      <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-3">Uji ALT Mikrobiologi (CFU/g)</td>
                      <td className="p-3">Maksimal 100 CFU/g</td>
                      <td className="p-3 text-emerald-300 font-bold">&lt; 10 CFU/g (Negatif)</td>
                      <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-3">Logam Berat (Pb, Cd, Hg, As)</td>
                      <td className="p-3">Sesuai Batas PerBPOM No. 23/2019</td>
                      <td className="p-3 text-emerald-300 font-bold">Tidak Terdeteksi (&lt; 0.01 ppm)</td>
                      <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Disetujui Oleh Head of QA:</p>
                  <p className="font-bold text-slate-200 mt-1">Apt. Maya Indah, S.Farm</p>
                  <p className="text-[10px] font-mono text-emerald-400">QA Manager License #2026-QA-88</p>
                </div>

                <button
                  onClick={() => alert(`Mengunduh Sertifikat Analisis (COA) PDF resmi untuk ${selectedBatchForCoa}...`)}
                  className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
                >
                  <Printer className="h-4 w-4" />
                  <span>Cetak / Unduh PDF COA</span>
                </button>
              </div>
            </div>
          )}

          {subTabCoaMsds === 'msds' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 max-w-4xl mx-auto text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    MATERIAL SAFETY DATA SHEET (MSDS / SDS GHS 16 SECTIONS)
                  </h3>
                  <p className="text-[11px] text-slate-400">Formulasi Sediaan Kosmetik: Luminance Glow Serum</p>
                </div>
                <button
                  onClick={() => alert('Unduh berkas MSDS GHS PDF lengkap...')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Unduh MSDS PDF
                </button>
              </div>

              <div className="space-y-3 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block">BAGIAN 1: Identifikasi Bahan & Perusahaan</span>
                  <p className="text-slate-300 mt-1">Nama Produk: Luminance Glow Serum 10% Niacinamide | Produsen: PT Paragonia Cosmetic Industri | Darurat: (021) 555-8899</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block">BAGIAN 2: Identifikasi Bahaya (GHS Classification)</span>
                  <p className="text-slate-300 mt-1">Status: Non-Hazardous Cosmetic Product sesuai PerBPOM. Tidak mudah terbakar. Dapat menyebabkan iritasi ringan pada mata jika kontak langsung.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block">BAGIAN 3: Komposisi / Informasi Bahan Aktif</span>
                  <p className="text-slate-300 mt-1">Aqua (Water) 75-80%, Niacinamide 10%, Centella Asiatica Extract 3%, Hyaluronic Acid 2%, Phenoxyethanol 0.8%.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block">BAGIAN 8: Kontrol Paparan & Perlindungan Diri (APD)</span>
                  <p className="text-slate-300 mt-1">Operator Cleanroom: Menggunakan jas lab steril, sarung tangan nitril, masker medis, dan kacamata goggle saat formulasi bulk.</p>
                </div>
              </div>
            </div>
          )}

          {subTabCoaMsds === 'halal' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 max-w-4xl mx-auto text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Audit Sistem Jaminan Halal (SJH / HAS 23000) BPJPH
                  </h3>
                  <p className="text-[11px] text-slate-400">Verifikasi Halal Bahan Baku Kosmetik & Lini Produksi Cleanroom</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  Sertifikat Halal ID32110008821
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200 block">1. Matriks Keterlacakan Bahan Baku Halal (Pork-Free Material)</span>
                    <span className="text-[11px] text-slate-400">100% Bahan baku memiliki Sertifikat Halal MUI / Lembaga Luar Negeri Diakui</span>
                  </div>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200 block">2. Log Pembersihan & Washout Lini Mixer Homogenizer (Halal Flushing)</span>
                    <span className="text-[11px] text-slate-400">Pembersihan dengan air murni Purified Water (PW) & Alkohol 70% Food Grade</span>
                  </div>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200 block">3. Sertifikasi Tim Auditor Internal Halal Perusahaan</span>
                    <span className="text-[11px] text-slate-400">3 Anggota Tim bersertifikat kualifikasi resmi LPPOM MUI</span>
                  </div>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INCI REGULATORY LIMIT CHECKER */}
      {/* ========================================================================= */}
      {activeTab === 'ingredient_checker' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-amber-400" /> Kalkulator & Compliance Checker Bahan Dibatasi (PerBPOM No. 23/2019)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi otomatis kadar maksimal bahan aktif, pengawet, dan tabir surya sesuai standar BPOM RI & ASEAN Cosmetic Directive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                Input Formulasi Bahan Aktif / INCI
              </h4>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Pilih Bahan Aktif INCI</label>
                <select
                  value={checkerInci}
                  onChange={(e) => setCheckerInci(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-slate-200 font-bold"
                >
                  {REGULATED_INGREDIENTS_DB.map((item) => (
                    <option key={item.inciName} value={item.inciName}>
                      {item.inciName} [{item.category}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tipe Sediaan Sediaan Kosmetik</label>
                <div className="grid grid-cols-2 gap-2 font-bold">
                  <button
                    type="button"
                    onClick={() => setCheckerProductType('leave_on')}
                    className={`p-2 rounded-xl border transition-all ${
                      checkerProductType === 'leave_on'
                        ? 'border-amber-500 bg-amber-950 text-amber-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Leave-On (Serum, Cream, Lotion)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckerProductType('rinse_off')}
                    className={`p-2 rounded-xl border transition-all ${
                      checkerProductType === 'rinse_off'
                        ? 'border-amber-500 bg-amber-950 text-amber-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Rinse-Off (Cleanser, Shampoo)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Konsentrasi Rencana dalam Formula (%)</label>
                  <span className="font-mono text-amber-300 font-bold text-sm">{checkerConcentration}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="30"
                  step="0.1"
                  value={checkerConcentration}
                  onChange={(e) => setCheckerConcentration(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong>Referensi Regulasi:</strong> {selectedRegulatedItem.bpomRegulationRef}
              </div>
            </div>

            {/* Analysis Result Box */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-3">
                  Hasil Evaluasi Kepatuhan Regulasi BPOM
                </h4>

                <div
                  className={`p-4 rounded-2xl border text-center space-y-2 mb-4 ${
                    isCompliant
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                      : 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                  }`}
                >
                  <div className="text-lg font-black tracking-wide">
                    {isCompliant ? 'COMPLIANT (MEMENUHI SYARAT)' : isProhibited ? 'DILARANG TOTAL (PROHIBITED)' : 'EXCEEDS MAXIMUM LIMIT'}
                  </div>
                  <div className="text-xs font-mono">
                    Kadar Input: <strong>{checkerConcentration}%</strong> | Batas Maksimal BPOM:{' '}
                    <strong>{maxAllowedForType}%</strong>
                  </div>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Nama Bahan (CAS):</span>
                    <span className="font-mono font-bold text-slate-100">{selectedRegulatedItem.inciName} ({selectedRegulatedItem.casNumber})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Kategori Bahan:</span>
                    <span className="font-bold text-amber-400">{selectedRegulatedItem.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Batas Max Leave-On:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedRegulatedItem.maxAllowedPctLeaveOn}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Batas Max Rinse-Off:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedRegulatedItem.maxAllowedPctRinseOff}%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-amber-200 space-y-1">
                <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-400">
                  Peringatan Kemasan Mandatory (Label Warning):
                </span>
                <p className="text-[11px] leading-relaxed">"{selectedRegulatedItem.mandatoryWarning}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI REGULATORY COPILOT */}
      {/* ========================================================================= */}
      {activeTab === 'ai_assistant' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              <h3 className="text-sm font-extrabold text-white">
                Asisten AI Regulasi Kosmetik & Compliance e-BPOM
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              PerBPOM No. 23/2019 & ISO 22716 Engine
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-2 text-[11px]">
            <button
              onClick={() => handleSendAiQuestion('Apa syarat pendaftaran e-BPOM NA untuk sunscreen SPF 50 PA++++?')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              ☀️ Syarat Sunscreen e-BPOM
            </button>
            <button
              onClick={() => handleSendAiQuestion('Berapa batas maksimal Salicylic Acid pada produk Exfoliating Toner leave-on?')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              🧪 Batas Salicylic Acid
            </button>
            <button
              onClick={() => handleSendAiQuestion('Dokumen apa saja yang wajib disiapkan untuk Berkas DIP / PIF Part I-IV?')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              📑 Struktur Berkas DIP 4-Part
            </button>
            <button
              onClick={() => handleSendAiQuestion('Persyaratan Halal BPJPH untuk bahan baku turunan asam lemak (Stearic Acid)?')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              ☪️ Audit Halal BPJPH
            </button>
          </div>

          {/* Chat Messages Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 min-h-[300px] max-h-[450px] overflow-y-auto space-y-3">
            {aiPrompts.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Question Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ketik pertanyaan regulasi BPOM, CPKB, atau Halal..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuestion()}
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSendAiQuestion()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Kirim</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRASI BPOM NA BARU */}
      {/* ========================================================================= */}
      {showAddBpomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" /> Form Registrasi Notifikasi e-BPOM NA Baru
              </h3>
              <button onClick={() => setShowAddBpomModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBpom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Produk Kosmetik Sesuai Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luminance Glow Serum 10% Niacinamide"
                  value={newBpom.productName}
                  onChange={(e) => setNewBpom({ ...newBpom, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paragonia Beauty"
                    value={newBpom.brandName}
                    onChange={(e) => setNewBpom({ ...newBpom, brandName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-amber-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Formula R&D</label>
                  <input
                    type="text"
                    placeholder="e.g. FORM-SK-01"
                    value={newBpom.formulaCode}
                    onChange={(e) => setNewBpom({ ...newBpom, formulaCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kategori Sediaan</label>
                  <select
                    value={newBpom.category}
                    onChange={(e) => setNewBpom({ ...newBpom, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  >
                    <option value="Skincare - Facial Serum">Skincare - Facial Serum</option>
                    <option value="Skincare - Moisturizer Gel">Skincare - Moisturizer Gel</option>
                    <option value="Skincare - Facial Wash">Skincare - Facial Wash</option>
                    <option value="Sunscreen - SPF Lotion">Sunscreen - SPF Lotion</option>
                    <option value="Decorative - Lip Tint">Decorative - Lip Tint</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Perusahaan Pemohon</label>
                  <input
                    type="text"
                    value={newBpom.applicantCompany}
                    onChange={(e) => setNewBpom({ ...newBpom, applicantCompany: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Kirim Registrasi ke Portal e-BPOM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPDATE STATUS EVALUASI BPOM */}
      {/* ========================================================================= */}
      {showUpdateStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-amber-400" /> Update Status Evaluasi BPOM
              </h3>
              <button onClick={() => setShowUpdateStatusModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Pilih status evaluasi terbaru dari Evaluator BPOM RI untuk SKU{' '}
                <strong className="text-amber-400">{selectedBpom.productName}</strong>:
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleUpdateStatusBpom('approved')}
                  className="w-full p-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-left flex justify-between items-center"
                >
                  <span>1. Approved (Nomor NA Resmi Terbit)</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => handleUpdateStatusBpom('under_evaluation')}
                  className="w-full p-3 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-left flex justify-between items-center"
                >
                  <span>2. Under Evaluation (Sedang Diuji Lab BPOM)</span>
                  <RefreshCw className="h-4 w-4 text-amber-400" />
                </button>

                <button
                  onClick={() => handleUpdateStatusBpom('revision_requested')}
                  className="w-full p-3 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-left flex justify-between items-center"
                >
                  <span>3. Revision Requested (Revisi Berkas DIP)</span>
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL CERTIFICATE e-BPOM NA PREVIEW */}
      {/* ========================================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> REPUBLIK INDONESIA - BADAN PENGAWAS OBAT DAN MAKANAN
              </span>
              <button onClick={() => setShowCertificateModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-2 border-emerald-500/40 rounded-2xl p-6 bg-slate-900/90 text-center space-y-4">
              <Award className="h-12 w-12 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  SURAT NOTIFIKASI BPOM RI
                </h2>
                <p className="text-xs font-mono text-emerald-400">
                  NOMOR: {selectedBpom.registrationNumber}
                </p>
              </div>

              <div className="text-xs text-slate-300 space-y-1 text-left bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                <div><strong>Nama Produk:</strong> {selectedBpom.productName}</div>
                <div><strong>Brand:</strong> {selectedBpom.brandName}</div>
                <div><strong>Pendaftar:</strong> {selectedBpom.applicantCompany}</div>
                <div><strong>Fasilitas Produksi:</strong> PT Paragonia Cleanroom Unit #01 (CPKB Gol A)</div>
                <div><strong>Masa Berlaku:</strong> s/d {selectedBpom.validUntil || '31 Desember 2031'}</div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                <span>Diperiksa Secara Otomatis via e-BPOM Cloud Engine</span>
                <span className="font-mono text-emerald-400 font-bold">STATUS: VALID & OFFICIAL</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  alert('Mengunduh Sertifikat e-BPOM NA Resmi (PDF)...');
                  setShowCertificateModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Unduh PDF Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH AUDIT CPKB FINDING */}
      {/* ========================================================================= */}
      {showAddCpkbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-400" /> Tambah Temuan Audit CPKB ISO 22716
              </h3>
              <button onClick={() => setShowAddCpkbModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCpkb} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nomor Klausal ISO 22716 / CPKB</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Klausal 5.3"
                    value={newCpkb.clause}
                    onChange={(e) => setNewCpkb({ ...newCpkb, clause: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kategori Audit</label>
                  <select
                    value={newCpkb.category}
                    onChange={(e) => setNewCpkb({ ...newCpkb, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  >
                    <option value="sanitation">Sanitasi & Higiene</option>
                    <option value="equipment">Peralatan Cleanroom</option>
                    <option value="personnel">Personel & APD</option>
                    <option value="production">Proses Produksi</option>
                    <option value="quality">Pengawasan Mutu QC</option>
                    <option value="documentation">Dokumentasi & Rekam Batch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Judul Temuan / Poin Kepatuhan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kualifikasi Udara Bertekanan & Chiller Cleanroom Class D"
                  value={newCpkb.title}
                  onChange={(e) => setNewCpkb({ ...newCpkb, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Status Kepatuhan Audit</label>
                <select
                  value={newCpkb.status}
                  onChange={(e) => setNewCpkb({ ...newCpkb, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                >
                  <option value="compliant">Compliant (Sesuai Standar)</option>
                  <option value="minor_nc">Minor NC (Temuan Ringan)</option>
                  <option value="major_nc">Major NC (Temuan Sedang)</option>
                  <option value="critical_nc">Critical NC (Temuan Berbahaya)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Deskripsi Bukti (Evidence)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail hasil observasi auditor di area cleanroom..."
                  value={newCpkb.evidence}
                  onChange={(e) => setNewCpkb({ ...newCpkb, evidence: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Rencana Perbaikan CAPA (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lakukan kalibrasi ulang instrumen dan re-training operator..."
                  value={newCpkb.correctiveAction}
                  onChange={(e) => setNewCpkb({ ...newCpkb, correctiveAction: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Item Audit CPKB
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
