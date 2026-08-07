export interface ExecutiveMetric {
  title: string;
  value: string | number;
  unit?: string;
  changePct: number;
  trend: 'up' | 'down' | 'stable';
  category: 'Financial' | 'Operational' | 'Quality' | 'EAM' | 'HR';
  target: string;
  status: 'Exceeded' | 'On Track' | 'At Risk';
}

export interface KpiItem {
  id: string;
  code: string;
  title: string;
  department: string;
  owner: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  achievementPct: number;
  scoreGrade: 'A - Superior' | 'B - Good' | 'C - Warning';
  trendMonthly: number[]; // 6 months trend
}

export interface PredictiveInsight {
  id: string;
  category: 'Production Delay' | 'Stock Out' | 'Machine Breakdown' | 'Quality Spike' | 'Cash Flow Risk';
  title: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  probabilityPct: number;
  timeframe: string;
  impactDescription: string;
  prescriptiveRecommendation: string;
  affectedModule: string;
}

export interface SmartAlertItem {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  module: 'MES' | 'LIMS QC' | 'EAM' | 'Finance' | 'WMS' | 'HRIS';
  title: string;
  description: string;
  actionRequired: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

export interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  createdDate: string;
  columns: string[];
  filterModule: string;
}

export const initialExecutiveMetrics: ExecutiveMetric[] = [
  {
    title: 'Total Revenue (YTD 2026)',
    value: 'Rp 48.500.000.000',
    changePct: 14.2,
    trend: 'up',
    category: 'Financial',
    target: 'Rp 45.000.000.000',
    status: 'Exceeded',
  },
  {
    title: 'Gross Profit Margin',
    value: '42.8%',
    changePct: 2.5,
    trend: 'up',
    category: 'Financial',
    target: '40.0%',
    status: 'Exceeded',
  },
  {
    title: 'Overall Equipment Effectiveness (OEE)',
    value: '88.5%',
    changePct: 3.1,
    trend: 'up',
    category: 'Operational',
    target: '85.0%',
    status: 'Exceeded',
  },
  {
    title: 'First Pass Batch Yield (QC Cleanroom)',
    value: '98.8%',
    changePct: 0.8,
    trend: 'up',
    category: 'Quality',
    target: '98.0%',
    status: 'On Track',
  },
  {
    title: 'On-Time In-Full Delivery (OTIF)',
    value: '96.2%',
    changePct: 1.2,
    trend: 'up',
    category: 'Operational',
    target: '95.0%',
    status: 'On Track',
  },
  {
    title: 'Inventory Turnover Ratio (ITR)',
    value: '6.4x / Thn',
    changePct: -0.5,
    trend: 'down',
    category: 'Operational',
    target: '7.0x / Thn',
    status: 'At Risk',
  },
  {
    title: 'Unplanned Machine Downtime (MTTR)',
    value: '1.2 Jam / Bln',
    changePct: -18.5, // lower is better
    trend: 'down',
    category: 'EAM',
    target: '2.0 Jam / Bln',
    status: 'Exceeded',
  },
  {
    title: 'Employee Productivity Index',
    value: '104.2 Pts',
    changePct: 4.5,
    trend: 'up',
    category: 'HR',
    target: '100.0 Pts',
    status: 'Exceeded',
  },
];

export const initialKpis: KpiItem[] = [
  {
    id: 'kpi-corp-01',
    code: 'KPI-FIN-01',
    title: 'Tingkat Marjin Laba Bersih (Net Profit Margin)',
    department: 'Finance & Executive',
    owner: 'CFO / Direktur Keuangan',
    targetValue: 22.0,
    actualValue: 24.5,
    unit: '%',
    achievementPct: 111.3,
    scoreGrade: 'A - Superior',
    trendMonthly: [21.0, 22.2, 23.0, 23.8, 24.1, 24.5],
  },
  {
    id: 'kpi-corp-02',
    code: 'KPI-MES-01',
    title: 'Efisiensi Produksi Homogenizer Tank & Zero Batch Failure',
    department: 'Factory Production MES',
    owner: 'Plant Operations Manager',
    targetValue: 97.5,
    actualValue: 98.8,
    unit: '%',
    achievementPct: 101.3,
    scoreGrade: 'A - Superior',
    trendMonthly: [96.0, 97.0, 97.8, 98.2, 98.5, 98.8],
  },
  {
    id: 'kpi-corp-03',
    code: 'KPI-QC-01',
    title: 'Tingkat Lolos Uji Sterilitas Micro Cleanroom CPKB',
    department: 'Quality Control LIMS',
    owner: 'Quality Assurance Supervisor',
    targetValue: 99.0,
    actualValue: 99.4,
    unit: '%',
    achievementPct: 100.4,
    scoreGrade: 'A - Superior',
    trendMonthly: [98.5, 98.9, 99.1, 99.2, 99.3, 99.4],
  },
  {
    id: 'kpi-corp-04',
    code: 'KPI-WMS-01',
    title: 'Akurasi Persediaan Bahan Baku Kosmetik (FEFO Accuracy)',
    department: 'Warehouse & PPIC',
    owner: 'Logistics Manager',
    targetValue: 99.5,
    actualValue: 98.9,
    unit: '%',
    achievementPct: 99.3,
    scoreGrade: 'B - Good',
    trendMonthly: [98.0, 98.2, 98.5, 98.7, 98.8, 98.9],
  },
];

export const initialPredictiveInsights: PredictiveInsight[] = [
  {
    id: 'pred-01',
    category: 'Stock Out',
    title: 'Potensi Kehabisan Bahan Baku Niacinamide 99% Grade A',
    riskLevel: 'High',
    probabilityPct: 88,
    timeframe: '7 Hari Ke Depan (14 Aug 2026)',
    impactDescription: 'Sisa stok saat ini (350 kg) hanya cukup untuk 2 batch Sunscreen Gel Serum. Jadwal PO terlama dari supplier Shanghai Chemical tiba 18 Aug 2026.',
    prescriptiveRecommendation: 'Segera lakukan ekspedisi air-freight atau alokasikan safety stock dari Gudang Cabang Surabaya sebanyak 200 kg.',
    affectedModule: 'PPIC & Inventory',
  },
  {
    id: 'pred-02',
    category: 'Machine Breakdown',
    title: 'Peringatan Dini Vibrasi Bearing Homogenizer Tank #01',
    riskLevel: 'Medium',
    probabilityPct: 74,
    timeframe: '12 Hari Ke Depan',
    impactDescription: 'Sensor IoT EAM mendeteksi lonjakan getaran 12Hz di shaft mixer utama. Risiko failure memicu potensi shutdown batch 1000L senilai Rp 180jt.',
    prescriptiveRecommendation: 'Jadwalkan Preventive Maintenance (PM) darurat pada jeda shift Sabtu 09 Aug 2026. Suku cadang Mechanical Seal #MS-40 tersedia di EAM.',
    affectedModule: 'EAM CMMS & MES',
  },
  {
    id: 'pred-03',
    category: 'Production Delay',
    title: 'Bottleneck Jalur Packaging Auto-Tubing Cream Gel',
    riskLevel: 'Low',
    probabilityPct: 62,
    timeframe: '15 Hari Ke Depan',
    impactDescription: 'Kecepatan filling saat ini (42 tube/menit) berada di bawah kapasitas nominal 50 tube/menit akibat penyesuaian nozzle viscose.',
    prescriptiveRecommendation: 'Lakukan retuning nozzle calibration dan tambahkan 1 operator bersertifikasi kualifikasi mesin pada Shift 2.',
    affectedModule: 'MES & HRIS',
  },
];

export const initialSmartAlerts: SmartAlertItem[] = [
  {
    id: 'alt-01',
    timestamp: '2026-08-07 08:15:00',
    severity: 'WARNING',
    module: 'WMS',
    title: 'Bahan Baku Hampir Kedaluwarsa (FEFO Notice)',
    description: 'Lot RAW-HYA-202509 Sodium Hyaluronate (45 kg) mendekati batas expired 30 hari.',
    actionRequired: 'Prioritaskan penggunaan pada Batch Hydrating Toner B-2026-0809.',
    status: 'Active',
  },
  {
    id: 'alt-02',
    timestamp: '2026-08-07 07:30:00',
    severity: 'CRITICAL',
    module: 'EAM',
    title: 'Suhu Chiller Cleanroom Class 10k Di Luar Toleransi',
    description: 'Sensor Chiller CH-02 mendeteksi suhu 24.2°C (Maksimal CPKB: 22.0°C).',
    actionRequired: 'Sistem otomatis beralih ke Standby Chiller CH-01. Lakukan verifikasi HVAC.',
    status: 'Active',
  },
  {
    id: 'alt-03',
    timestamp: '2026-08-06 17:00:00',
    severity: 'INFO',
    module: 'Finance',
    title: 'Jurnal Otomatis Gaji Karyawan Periode 2026-08 Selesai',
    description: 'Total beban gaji Rp 44.205.000 telah diposting ke Buku Besar akun 6100-Salaries.',
    actionRequired: 'Lakukan verifikasi kasir bank untuk transfer payroll.',
    status: 'Acknowledged',
  },
];

export const initialReportTemplates: ReportTemplate[] = [
  {
    id: 'rpt-01',
    title: 'Laporan Eksekutif Laba Rugi & HPP Produk Kosmetik (COGS)',
    category: 'Financial',
    createdDate: '2026-08-01',
    columns: ['Periode', 'Revenue', 'Bahan Baku', 'Tenaga Kerja', 'Overhead Pabrik', 'Gross Margin %', 'Net Profit'],
    filterModule: 'Finance & Accounting',
  },
  {
    id: 'rpt-02',
    title: 'Laporan Efisiensi Batch Produksi & Yield MES Cleanroom',
    category: 'Manufacturing',
    createdDate: '2026-08-02',
    columns: ['Batch No', 'Formula SKU', 'Target Yield', 'Actual Yield', 'OEE %', 'Quality QC Pass'],
    filterModule: 'MES & PPIC',
  },
  {
    id: 'rpt-03',
    title: 'Laporan Audit CPKB ISO 22716 & Micro Bio Test Result',
    category: 'Quality',
    createdDate: '2026-08-05',
    columns: ['LIMS Sample ID', 'Lot No', 'Pathogen Count', 'Viscosity cPs', 'pH Level', 'Status Release'],
    filterModule: 'LIMS Quality',
  },
];
