import express, { Request, Response } from 'express';
import {
  initialExecutiveMetrics,
  initialKpis,
  initialPredictiveInsights,
  initialSmartAlerts,
  initialReportTemplates,
  ExecutiveMetric,
  KpiItem,
  PredictiveInsight,
  SmartAlertItem,
  ReportTemplate,
} from './biData.js';

export const biRouter = express.Router();

let metricsList = [...initialExecutiveMetrics];
let kpiList = [...initialKpis];
let predictionsList = [...initialPredictiveInsights];
let alertsList = [...initialSmartAlerts];
let reportsList = [...initialReportTemplates];

// ==========================================
// 1. EXECUTIVE METRICS & DASHBOARD
// ==========================================
biRouter.get('/bi/dashboard', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      metrics: metricsList,
      summary: {
        totalRevenueYtd: 'Rp 48.500.000.000',
        grossMarginPct: '42.8%',
        overallOeePct: '88.5%',
        qcFirstPassYield: '98.8%',
        otifDeliveryPct: '96.2%',
        activeAlertsCount: alertsList.filter((a) => a.status === 'Active').length,
      },
    },
  });
});

// ==========================================
// 2. KPI MANAGEMENT & SCORECARDS
// ==========================================
biRouter.get('/bi/kpis', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: kpiList.length,
    data: kpiList,
  });
});

biRouter.post('/bi/kpis', (req: Request, res: Response) => {
  const { title, department, owner, targetValue, actualValue, unit } = req.body;

  if (!title || !department) {
    return res.status(400).json({ error: 'Judul KPI dan Departemen wajib diisi.' });
  }

  const target = Number(targetValue || 100);
  const actual = Number(actualValue || 95);
  const ach = Math.round((actual / target) * 1000) / 10;

  const newKpi: KpiItem = {
    id: `kpi-${Date.now()}`,
    code: `KPI-${department.substring(0, 3).toUpperCase()}-${String(kpiList.length + 1).padStart(2, '0')}`,
    title,
    department,
    owner: owner || 'Department Manager',
    targetValue: target,
    actualValue: actual,
    unit: unit || '%',
    achievementPct: ach,
    scoreGrade: ach >= 100 ? 'A - Superior' : ach >= 90 ? 'B - Good' : 'C - Warning',
    trendMonthly: [actual * 0.9, actual * 0.93, actual * 0.96, actual * 0.98, actual * 0.99, actual],
  };

  kpiList.unshift(newKpi);
  res.status(201).json({ success: true, message: 'KPI baru berhasil didaftarkan.', data: newKpi });
});

// ==========================================
// 3. PREDICTIVE & PRESCRIPTIVE ANALYTICS
// ==========================================
biRouter.get('/bi/predictive', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: predictionsList,
  });
});

// ==========================================
// 4. SMART ALERTS API
// ==========================================
biRouter.get('/bi/alerts', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: alertsList,
  });
});

biRouter.post('/bi/alerts/:id/acknowledge', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = alertsList.find((a) => a.id === id);
  if (alert) {
    alert.status = 'Acknowledged';
    return res.json({ success: true, message: 'Peringatan berhasil dikonfirmasi.', data: alert });
  }
  res.status(404).json({ error: 'Alert tidak ditemukan.' });
});

// ==========================================
// 5. REPORT BUILDER API
// ==========================================
biRouter.get('/bi/reports', (req: Request, res: Response) => {
  res.json({ success: true, data: reportsList });
});

biRouter.post('/bi/reports', (req: Request, res: Response) => {
  const { title, category, columns, filterModule } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Judul Laporan wajib diisi.' });
  }

  const newReport: ReportTemplate = {
    id: `rpt-${Date.now()}`,
    title,
    category: category || 'General ERP',
    createdDate: new Date().toISOString().substring(0, 10),
    columns: columns || ['Periode', 'Item Code', 'Quantity', 'Total Value'],
    filterModule: filterModule || 'All Modules',
  };

  reportsList.unshift(newReport);
  res.status(201).json({ success: true, message: 'Template Laporan Kustom berhasil disimpan.', data: newReport });
});

// ==========================================
// 6. AI COPILOT & NATURAL LANGUAGE QUERY
// ==========================================
biRouter.post('/bi/copilot', async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query pertanyaan tidak boleh kosong.' });
  }

  const lower = query.toLowerCase();

  // Intelligent Contextual Rules matching ERP modules
  if (lower.includes('penjualan') || lower.includes('sales') || lower.includes('revenue')) {
    return res.json({
      success: true,
      query,
      answer: `📊 **Ringkasan Penjualan YTD 2026 CosmoManufacture ERP:**\n\n• **Total Revenue:** Rp 48.500.000.000 (Naik +14.2% YoY)\n• **SKU Penjualan Tertinggi:** Brightening Sunscreen Serum SPF50 (18.400 unit)\n• **Gross Profit Margin:** 42.8% (Target: 40.0%)\n• **Pelanggan Utama:** Pt Beauty Glow Nusantara & Guardian Retail Indonesia\n\n💡 **Rekomendasi Copilot:** Alokasikan tambahan kapasitas mesin filling line #02 untuk antisipasi lonjakan pesanan promo akhir bulan.`,
      relatedMetrics: [
        { label: 'Revenue YTD', value: 'Rp 48.5B' },
        { label: 'Gross Profit', value: '42.8%' },
      ],
    });
  }

  if (lower.includes('downtime') || lower.includes('mesin') || lower.includes('eam') || lower.includes('maintenance')) {
    return res.json({
      success: true,
      query,
      answer: `⚙️ **Analisis Performa Mesin Pabrik Kosmetik:**\n\n• **Downtime Tertinggi:** Mixing Homogenizer Tank #01 (Total Downtime: 1.8 jam bulan ini)\n• **Penyebab Utama:** Keausan Mechanical Seal #MS-40 akibat gesekan emulsi viskositas tinggi.\n• **Status Chiller Cleanroom:** Chiller CH-02 dalam pemeliharaan preventif, cadangan CH-01 aktif.\n• **MTTR Rata-rata:** 42 Menit (Target <= 60 Menit)\n\n💡 **Tindakan Disarankan:** Jadwalkan pemeliharaan preventif (PM) Homogenizer Tank #01 pada Sabtu 09 Aug 2026. Suku cadang Mechanical Seal siap di Gudang EAM.`,
      relatedMetrics: [
        { label: 'OEE Pabrik', value: '88.5%' },
        { label: 'Unplanned MTTR', value: '1.2 Jam/Bln' },
      ],
    });
  }

  if (lower.includes('material') || lower.includes('stok') || lower.includes('inventory') || lower.includes('habis')) {
    return res.json({
      success: true,
      query,
      answer: `📦 **Status Persediaan Bahan Baku & Packaging Kosmetik:**\n\n• ⚠️ **Peringatan Kritis (Stockout Risk):** Niacinamide 99% Grade A sisa **350 kg** (Prediksi kehabisan dalam 7 hari).\n• **FEFO Alert:** 45 kg Sodium Hyaluronate mendekati kedaluwarsa 30 hari.\n• **Nilai Total Inventori:** Rp 6.820.000.000\n• **Akurasi Gudang:** 98.9% (Verified by Batch RFID Barcode)\n\n💡 **Tindakan Disarankan:** Lakukan pengiriman udara (air freight) darurat Niacinamide dari supplier Shanghai Chemical atau transfer dari Gudang Surabaya.`,
      relatedMetrics: [
        { label: 'Critical Items', value: '1 Item' },
        { label: 'Inventory Value', value: 'Rp 6.82B' },
      ],
    });
  }

  if (lower.includes('karyawan') || lower.includes('hr') || lower.includes('payroll') || lower.includes('gaji')) {
    return res.json({
      success: true,
      query,
      answer: `👥 **Ringkasan SDM & Payroll CosmoManufacture AI:**\n\n• **Total Karyawan:** 128 Orang (Produksi, R&D, QC, Maintenance, Admin)\n• **Presensi Hari Ini:** 98.2% (Tercatat via Face Recognition Cleanroom Gate)\n• **Total Anggaran Payroll:** Rp 44.205.000 (Termasuk BPJS + PPh 21 TER)\n• **Kualifikasi Mesin CPKB:** 94.5% Operator bersertifikat kualifikasi resmi BPOM.\n\n💡 **Rekomendasi Copilot:** Jadwalkan sertifikasi ulang ISO 22716 bagi 3 operator baru sebelum masuk ke area Cleanroom Class 10k.`,
      relatedMetrics: [
        { label: 'Karyawan Aktif', value: '128 Staff' },
        { label: 'Presensi', value: '98.2%' },
      ],
    });
  }

  // Default Generic Copilot Response
  res.json({
    success: true,
    query,
    answer: `🤖 **CosmoManufacture Executive AI Copilot Response:**\n\nHasil query "${query}":\n\n• **Status ERP:** Seluruh 18 modul ERP (MES, QC LIMS, EAM, Finance, HRIS, PPIC, Sales) beroperasi secara optimal.\n• **Kesehatan Finansial:** Gross Margin stabil pada **42.8%** dengan Kas Aktif Rp 12.4M.\n• **Tingkat Kepatuhan CPKB:** 100% Lolos Audit Sterilitas Micro Lab.\n\nBisa saya bantu dengan query spesifik mengenai Penjualan, Downtime Mesin, Stok Bahan Baku, atau Anggaran Payroll?`,
    relatedMetrics: [{ label: 'System Health', value: '100% Operational' }],
  });
});

export default biRouter;
