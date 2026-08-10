export interface BpomSubmission {
  id: string;
  submissionCode: string;
  productName: string;
  brandName: string;
  category: string;
  formulaCode: string;
  naNumber: string;
  expiryDateNa: string;
  status: 'Draft' | 'Submitted to BPOM' | 'Under Review' | 'Approved (Izin Edar Active)' | 'Revision Required';
  dipPart1Complete: boolean;
  dipPart2Complete: boolean;
  dipPart3Complete: boolean;
  dipPart4Complete: boolean;
  halalStatus: 'Sertifikat Halal Active' | 'In Process BPJPH' | 'Pending Submission';
  halalCertNo: string;
}

export interface CpkbAuditItem {
  id: string;
  clause: string;
  title: string;
  category: 'Sanitasi & Higiene' | 'Peralatan & Mesin' | 'Personalia & Cleanroom' | 'Dokumentasi & Batch Record' | 'Pengawasan Mutu (QC)';
  status: 'Compliant' | 'Minor NC' | 'Major NC' | 'Critical NC';
  evidence: string;
  correctiveAction: string;
  targetDate: string;
  picName: string;
}

export interface RegulatedIngredientRef {
  inciName: string;
  casNumber: string;
  category: 'Restricted' | 'Prohibited' | 'Preservative' | 'UV Filter' | 'Colorant';
  maxAllowedPctLeaveOn: number;
  maxAllowedPctRinseOff: number;
  mandatoryWarning: string;
  bpomRegulationRef: string;
}

export const initialBpomSubmissions: BpomSubmission[] = [
  {
    id: 'bpom-01',
    submissionCode: 'SUB-BPOM-2026-001',
    productName: 'Aura Glow Radiant Brightening Serum 30ml',
    brandName: 'Aura Glow Cosmetics',
    category: 'Skincare - Facial Serum',
    formulaCode: 'FORM-SER-008-V3',
    naNumber: 'NA18261900123',
    expiryDateNa: '2031-08-15',
    status: 'Approved (Izin Edar Active)',
    dipPart1Complete: true,
    dipPart2Complete: true,
    dipPart3Complete: true,
    dipPart4Complete: true,
    halalStatus: 'Sertifikat Halal Active',
    halalCertNo: 'ID00410001234560723',
  },
  {
    id: 'bpom-02',
    submissionCode: 'SUB-BPOM-2026-002',
    productName: 'Velvet Matte Cushion Foundation SPF 35',
    brandName: 'Velvet Beauty',
    category: 'Decorative - Face Makeup',
    formulaCode: 'FORM-CSH-012-V1',
    naNumber: 'NA18260300456',
    expiryDateNa: '2031-09-01',
    status: 'Approved (Izin Edar Active)',
    dipPart1Complete: true,
    dipPart2Complete: true,
    dipPart3Complete: true,
    dipPart4Complete: true,
    halalStatus: 'Sertifikat Halal Active',
    halalCertNo: 'ID00410001234570823',
  },
  {
    id: 'bpom-03',
    submissionCode: 'SUB-BPOM-2026-003',
    productName: 'Hyaluronic Hydrating Facial Cleanser 100ml',
    brandName: 'HydroPure',
    category: 'Skincare - Cleanser',
    formulaCode: 'FORM-CLN-004-V2',
    naNumber: 'SUB-PENDING-2026-08',
    expiryDateNa: 'Pending Approval',
    status: 'Under Review',
    dipPart1Complete: true,
    dipPart2Complete: true,
    dipPart3Complete: true,
    dipPart4Complete: false,
    halalStatus: 'In Process BPJPH',
    halalCertNo: 'REG-BPJPH-2026-8812',
  },
];

export const initialCpkbAuditItems: CpkbAuditItem[] = [
  {
    id: 'cpkb-01',
    clause: 'Klausal 4.1 Sanitasi & Higiene',
    title: 'Kebersihan Air Shower & Tekanan Udara Positif Room Grade B',
    category: 'Sanitasi & Higiene',
    status: 'Compliant',
    evidence: 'Logbook pembersihan harian dan kalibrasi manometer air shower terverifikasi 15 Pa.',
    correctiveAction: 'N/A - Sudah Sesuai Standard BPOM',
    targetDate: '2026-08-01',
    picName: 'Rina Sulistyo (QA Manager)',
  },
  {
    id: 'cpkb-02',
    clause: 'Klausal 5.3 Kualifikasi Peralatan',
    title: 'Kalibrasi Sensor Suhu Vacuum Homogenizer Mixing Tank 1000L',
    category: 'Peralatan & Mesin',
    status: 'Compliant',
    evidence: 'Sertifikat kalibrasi KAN No. KAL-2026-0812 berlaku hingga Agustus 2027.',
    correctiveAction: 'N/A',
    targetDate: '2026-08-05',
    picName: 'Budi Santoso (Maintenance Head)',
  },
  {
    id: 'cpkb-03',
    clause: 'Klausal 7.2 Dokumentasi Batch Record',
    title: 'Pengisian Penimbangan Bahan Baku Utama oleh 2 Orang Operator',
    category: 'Dokumentasi & Batch Record',
    status: 'Minor NC',
    evidence: 'Ditemukan 1 lembar Batch Record LOT-PAR-2026-0710 dengan tanda tangan verifikator terlambat 2 jam.',
    correctiveAction: 'Re-training SOP Penimbangan Presisi dan sistem e-Signature MES real-time.',
    targetDate: '2026-08-25',
    picName: 'Dewi Lestari (Production Supervisor)',
  },
];

export const initialRegulatedIngredients: RegulatedIngredientRef[] = [
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
    mandatoryWarning: 'Tidak digunakan untuk anak di bawah usia 3 tahun. Jangan digunakan pada kulit yang terkelupas.',
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
];
