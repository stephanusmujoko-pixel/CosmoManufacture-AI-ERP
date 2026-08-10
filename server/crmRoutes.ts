import { Router, Request, Response } from 'express';
import {
  dbLeads,
  dbQuotations,
  dbSalesOrders,
  dbDeliveryOrders,
  dbActivities,
  dbSampleRequests,
  dbBpomAssistance,
  Lead,
  SalesQuotation,
  SalesOrder,
  DeliveryOrder,
  CustomerActivity,
  SampleRequest,
  BpomHalalAssistance,
} from './crmData.js';
import { dbCustomers, dbProducts } from './masterData.js';

export const crmRouter = Router();

// Tenant & Audit Middleware
crmRouter.use((req, res, next) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 't-cosmo-01';
  (req as any).tenantId = tenantId;
  next();
});

// 1. LEADS CRUD & PIPELINE TRANSITION
crmRouter.get('/crm/leads', (req: Request, res: Response) => {
  const { stage, priority, search } = req.query;
  let result = [...dbLeads];

  if (stage) {
    result = result.filter((l) => l.stage === stage);
  }
  if (priority) {
    result = result.filter((l) => l.priority === priority);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (l) =>
        l.companyName.toLowerCase().includes(q) ||
        l.picName.toLowerCase().includes(q) ||
        l.leadNumber.toLowerCase().includes(q) ||
        l.industry.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    totalLeads: result.length,
    data: result,
  });
});

crmRouter.post('/crm/leads', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.companyName || !body.picName) {
    return res.status(400).json({ success: false, message: 'Nama perusahaan dan PIC wajib diisi.' });
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    leadNumber: `LD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    leadSource: body.leadSource || 'Website Inquiry',
    industry: body.industry || 'Beauty & Skincare',
    companyName: body.companyName,
    picName: body.picName,
    email: body.email || 'pic@brand.co.id',
    phone: body.phone || '+62 812 0000 0000',
    whatsapp: body.whatsapp || '+62 812 0000 0000',
    address: body.address || 'Jakarta, Indonesia',
    province: body.province || 'DKI Jakarta',
    city: body.city || 'Jakarta Selatan',
    potentialValueRp: body.potentialValueRp || 200000000,
    probabilityPct: body.probabilityPct || 50,
    stage: body.stage || 'New Lead',
    assignedSalesperson: body.assignedSalesperson || 'Dimas Anggara (Senior Account Executive)',
    nextFollowUpDate: body.nextFollowUpDate || '2026-08-15',
    priority: body.priority || 'High',
    score: Math.floor(60 + Math.random() * 35),
    notes: body.notes || 'Inquiry baru via CRM System.',
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbLeads.unshift(newLead);

  return res.status(201).json({
    success: true,
    message: 'Lead B2B baru berhasil didaftarkan.',
    data: newLead,
  });
});

crmRouter.patch('/crm/leads/:id/stage', (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage } = req.body;

  const lead = dbLeads.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead tidak ditemukan.' });
  }

  lead.stage = stage;
  if (stage === 'Won') lead.probabilityPct = 100;
  if (stage === 'Lost') lead.probabilityPct = 0;

  return res.json({
    success: true,
    message: `Tahapan Lead ${lead.leadNumber} diperbarui menjadi: ${stage}`,
    data: lead,
  });
});

// 2. SALES QUOTATIONS CRUD
crmRouter.get('/crm/quotations', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalQuotations: dbQuotations.length,
    data: dbQuotations,
  });
});

crmRouter.post('/crm/quotations', (req: Request, res: Response) => {
  const body = req.body;

  const newQuo: SalesQuotation = {
    id: `quo-${Date.now()}`,
    quotationNumber: `QUO/SALES/2026/08/${Math.floor(100 + Math.random() * 900)}`,
    version: '1.0',
    leadId: body.leadId,
    customerId: body.customerId || 'cust-001',
    customerName: body.customerName || 'PT Beauty Glow Indonesia',
    customerPic: body.customerPic || 'Rina Kartika',
    customerEmail: body.customerEmail || 'rina@beautyglow.co.id',
    salespersonName: body.salespersonName || 'Dimas Anggara',
    validUntil: '2026-08-31',
    paymentTermDays: 30,
    items: body.items || [
      {
        id: `qitem-${Date.now()}`,
        productSku: 'SKU-FG-LUM-01',
        productName: 'Luminance Glow Serum 30ml',
        quantityUnit: 5000,
        unitPriceRp: 32000,
        discountPct: 0,
        subtotalRp: 160000000,
        packagingSpec: 'Dropper Glass Amber 30ml',
        targetBpom: 'NA18240199882',
      },
    ],
    subtotalRp: 160000000,
    discountTotalRp: 0,
    taxPpnRp: 17600000,
    grandTotalRp: 177600000,
    status: 'Submitted',
    approvalFlow: [
      { step: 'Sales Manager Approval', approverRole: 'Sales Manager', status: 'Approved', approvedBy: 'Dimas Anggara', date: new Date().toISOString() },
    ],
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbQuotations.unshift(newQuo);

  return res.status(201).json({
    success: true,
    message: 'Sales Quotation penawaran harga berhasil dibuat.',
    data: newQuo,
  });
});

// 3. SALES ORDERS (SO)
crmRouter.get('/crm/sales-orders', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalSalesOrders: dbSalesOrders.length,
    data: dbSalesOrders,
  });
});

crmRouter.post('/crm/sales-orders/convert-from-quotation', (req: Request, res: Response) => {
  const { quotationId } = req.body;
  const quo = dbQuotations.find((q) => q.id === quotationId);

  if (!quo) {
    return res.status(404).json({ success: false, message: 'Sales Quotation tidak ditemukan.' });
  }

  const newSo: SalesOrder = {
    id: `so-${Date.now()}`,
    soNumber: `SO/CPKB/2026/08/${Math.floor(1000 + Math.random() * 9000)}`,
    quotationNumber: quo.quotationNumber,
    customerId: quo.customerId,
    customerName: quo.customerName,
    brandName: quo.customerName,
    deliveryAddress: 'Gudang Utama Klien Maklon',
    warehouseCode: 'WH-FG-02',
    salespersonName: quo.salespersonName,
    paymentTermDays: quo.paymentTermDays,
    shippingMethod: 'Express Trucking',
    items: quo.items.map((it) => ({
      id: `soitem-${Date.now()}-${Math.random()}`,
      productSku: it.productSku,
      productName: it.productName,
      quantityOrdered: it.quantityUnit,
      quantityDelivered: 0,
      unitPriceRp: it.unitPriceRp,
      subtotalRp: it.subtotalRp,
    })),
    subtotalRp: quo.subtotalRp,
    taxPpnRp: quo.taxPpnRp,
    grandTotalRp: quo.grandTotalRp,
    status: 'Confirmed',
    createdDate: new Date().toISOString().split('T')[0],
    targetDeliveryDate: '2026-08-25',
  };

  quo.status = 'Converted to SO';
  dbSalesOrders.unshift(newSo);

  return res.json({
    success: true,
    message: `Sales Order ${newSo.soNumber} berhasil diterbitkan dari Quotation ${quo.quotationNumber}.`,
    data: newSo,
  });
});

// 4. DELIVERY ORDERS (DO)
crmRouter.get('/crm/delivery-orders', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalDeliveryOrders: dbDeliveryOrders.length,
    data: dbDeliveryOrders,
  });
});

crmRouter.post('/crm/delivery-orders', (req: Request, res: Response) => {
  const body = req.body;
  const newDo: DeliveryOrder = {
    id: `do-${Date.now()}`,
    doNumber: `DO/LOG/2026/08/${Math.floor(100 + Math.random() * 900)}`,
    soNumber: body.soNumber || 'SO/CPKB/2026/08/0088',
    customerName: body.customerName || 'PT Beauty Glow Indonesia',
    shippingAddress: body.shippingAddress || 'Gudang Utama Klien, Pergudangan Taman Tekno Blok D/5',
    courierName: body.courierName || 'Internal Cold Chain Logistics',
    trackingNumber: `TRK-MAKLON-${Date.now().toString().slice(-6)}`,
    driverName: body.driverName || 'Agus Setiawan (SIM B2)',
    vehiclePlateNumber: body.vehiclePlateNumber || 'B 9201 PQA',
    dispatchDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    estimatedArrival: '2026-08-10 14:00',
    status: 'In Transit',
  };

  dbDeliveryOrders.unshift(newDo);
  return res.status(201).json({
    success: true,
    message: `Delivery Order ${newDo.doNumber} berhasil diterbitkan.`,
    data: newDo,
  });
});

// 5. SAMPLE REQUESTS (R&D LAB TRIALS)
crmRouter.get('/crm/sample-requests', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalSampleRequests: dbSampleRequests.length,
    data: dbSampleRequests,
  });
});

crmRouter.post('/crm/sample-requests', (req: Request, res: Response) => {
  const body = req.body;
  const newSamp: SampleRequest = {
    id: `samp-${Date.now()}`,
    sampleNumber: `SAMP/RD/2026/08/${Math.floor(100 + Math.random() * 900)}`,
    leadId: body.leadId,
    customerName: body.customerName || 'Klien Baru Maklon',
    brandName: body.brandName || 'Brand Beauty',
    formulaName: body.formulaName || 'Hydrating Face Serum Niacinamide',
    labBatchNumber: `BATCH-LAB-${Math.floor(8000 + Math.random() * 1000)}`,
    scentNote: body.scentNote || 'Natural Essential Oil',
    textureSpec: body.textureSpec || 'Lightweight Watery Gel',
    feedbackStatus: 'Pending Review',
    dispatchDate: new Date().toISOString().split('T')[0],
    salespersonName: body.salespersonName || 'Dimas Anggara',
  };

  dbSampleRequests.unshift(newSamp);
  return res.status(201).json({
    success: true,
    message: `Permintaan Sampel Lab R&D ${newSamp.sampleNumber} berhasil dikirim ke formulator.`,
    data: newSamp,
  });
});

crmRouter.patch('/crm/sample-requests/:id/feedback', (req: Request, res: Response) => {
  const { id } = req.params;
  const { feedbackStatus, revisionNotes } = req.body;

  const samp = dbSampleRequests.find((s) => s.id === id);
  if (!samp) {
    return res.status(404).json({ success: false, message: 'Sampel request tidak ditemukan.' });
  }

  samp.feedbackStatus = feedbackStatus;
  if (revisionNotes) samp.revisionNotes = revisionNotes;

  return res.json({
    success: true,
    message: `Status ulasan sampel ${samp.sampleNumber} diperbarui menjadi: ${feedbackStatus}`,
    data: samp,
  });
});

// 6. BPOM & HALAL ASSISTANCE TRACKER
crmRouter.get('/crm/bpom-assistance', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalAssistance: dbBpomAssistance.length,
    data: dbBpomAssistance,
  });
});

crmRouter.post('/crm/bpom-assistance', (req: Request, res: Response) => {
  const body = req.body;
  const newBpom: BpomHalalAssistance = {
    id: `bpom-${Date.now()}`,
    customerName: body.customerName || 'PT Beauty Glow Indonesia',
    brandName: body.brandName || 'BeautyGlow Cosmetics',
    productName: body.productName || 'Serum Glowing Brightening',
    targetBpomCategory: body.targetBpomCategory || 'NA - Kosmetik Perawatan Kulit',
    bpomSubmissionStatus: body.bpomSubmissionStatus || 'Uji Lab Stabilitas & Mikrobiologi',
    estimatedTargetDate: body.estimatedTargetDate || '2026-09-30',
  };

  dbBpomAssistance.unshift(newBpom);
  return res.status(201).json({
    success: true,
    message: 'Registrasi Pendampingan BPOM NA & Halal berhasil didaftarkan.',
    data: newBpom,
  });
});

// 7. AI SALES ASSISTANT CHAT
crmRouter.post('/crm/ai-chat', (req: Request, res: Response) => {
  const { message } = req.body;
  const q = (message || '').toLowerCase();

  let reply = 'AI Sales & Revenue Copilot aktif. Saya siap membantu analisis deal size, rekomendasi harga MOQ, estimasi durasi BPOM NA, dan strategi closing B2B maklon.';

  if (q.includes('lead') || q.includes('score') || q.includes('prospek') || q.includes('glownation')) {
    reply = '🎯 **Analisis AI Lead Scoring & Priority:**\n- **GlowNation Skincare Inc.** (Score 88/100): Probabilitas closing 80%. Potensi omset Rp 450.000.000. Rekomendasi: Kirimkan Sales Quotation harga promo MOQ 10.000 pcs dengan gratis biaya pendaftaran BPOM NA.';
  } else if (q.includes('bpom') || q.includes('halal') || q.includes('izin') || q.includes('regis')) {
    reply = '📑 **SLA Pendaftaran BPOM NA & Halal Maklon:**\n1. Uji Stabilitas 3 Bulan & Mikrobiologi: ~30 Hari.\n2. Injeksi Dokumen e-Registration BPOM: 7-14 Hari Kerja.\n3. Rata-rata terbit sertifikat Halal LPPOM MUI: 14 Hari. Disarankan menginfokan klien estimasi total SLA 45-60 Hari.';
  } else if (q.includes('harga') || q.includes('margin') || q.includes('diskon') || q.includes('moq')) {
    reply = '💰 **Simulasi Marjin & Tiering Harga Maklon:**\n- **1.000 - 4.999 Pcs**: Rp 35.000 / pcs (Gross Margin 42%).\n- **5.000 - 9.999 Pcs**: Rp 32.000 / pcs (Gross Margin 38%).\n- **>= 10.000 Pcs**: Rp 30.400 / pcs (Gross Margin 35% - Best Selling Volume Tier).';
  } else if (q.includes('forecast') || q.includes('target') || q.includes('omset') || q.includes('revenue')) {
    reply = '📈 **Proyeksi Revenue AI Bulan Depan:**\n- **Estimasi Omset**: Rp 1,28 Miliar (+22% dari bulan ini).\n- **Key Revenue Drivers**: Closing deal GlowNation (450M) & repeat order SO BeautyGlow Serum (574M).';
  }

  return res.json({ success: true, reply });
});

// 5. CUSTOMER ACTIVITIES
crmRouter.get('/crm/activities', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalActivities: dbActivities.length,
    data: dbActivities,
  });
});

crmRouter.post('/crm/activities', (req: Request, res: Response) => {
  const body = req.body;

  const newAct: CustomerActivity = {
    id: `act-${Date.now()}`,
    entityId: body.entityId || 'lead-001',
    entityName: body.entityName || 'GlowNation Skincare Inc.',
    type: body.type || 'Meeting',
    title: body.title || 'Follow-up Diskusi Formulasi Sampel',
    summary: body.summary || 'Meeting daring membahas revisi viskositas gel barrier.',
    activityDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    salespersonName: body.salespersonName || 'Dimas Anggara',
    outcome: body.outcome || 'Positive',
  };

  dbActivities.unshift(newAct);

  return res.status(201).json({
    success: true,
    message: 'Aktivitas CRM berhasil dicatat ke timeline.',
    data: newAct,
  });
});

// 6. AI SALES INSIGHTS & FORECASTING
crmRouter.get('/crm/ai-sales-insights', (req: Request, res: Response) => {
  const totalPipelineRp = dbLeads.reduce((sum, l) => sum + (l.potentialValueRp * l.probabilityPct) / 100, 0);

  return res.json({
    success: true,
    insights: {
      predictedMonthlyRevenueRp: 1280000000,
      forecastAccuracyPct: 94.2,
      pipelineValueRp: totalPipelineRp,
      leadScoringTopOpportunities: dbLeads.filter((l) => l.score >= 75),
      crossSellRecommendations: [
        {
          targetCustomer: 'PT Beauty Glow Indonesia',
          recommendedProduct: 'UV Defense Sunscreen Gel SPF 50 PA++++',
          reasoning: 'Glow Serum & Barrier Cream best-seller mereka memiliki impresi klaim perlindungan UV tinggi dari end-user.',
          expectedValueRp: 350000000,
        },
      ],
      churnRiskAlerts: [
        {
          customerName: 'CV SkinAura Herbal',
          riskLevel: 'Medium',
          lastOrderDaysAgo: 65,
          recommendedAction: 'Kirimkan sampel formulasi baru Anti-Aging Retinol Micro-encapsulated & penawaran diskon volume 5%.',
        },
      ],
    },
  });
});

// 7. CRM & SALES DASHBOARD METRICS
crmRouter.get('/crm/dashboard-metrics', (req: Request, res: Response) => {
  const totalLeads = dbLeads.length;
  const activeQuotations = dbQuotations.length;
  const confirmedSo = dbSalesOrders.length;
  const totalRevenueMonthRp = dbSalesOrders.reduce((sum, so) => sum + so.grandTotalRp, 0);

  return res.json({
    success: true,
    summary: {
      salesTodayRp: 125000000,
      salesMonthRp: totalRevenueMonthRp,
      salesYearRp: 4850000000,
      totalLeadsCount: totalLeads,
      activeQuotationsCount: activeQuotations,
      confirmedSoCount: confirmedSo,
      conversionRatePct: 42.5,
      pipelineValueRp: 880000000,
      topCustomers: dbCustomers.slice(0, 3),
      topProducts: dbProducts.slice(0, 3),
    },
  });
});
