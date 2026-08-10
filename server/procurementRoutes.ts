import { Router, Request, Response } from 'express';
import {
  dbPurchaseRequisitions,
  dbRfqs,
  dbPurchaseOrders,
  dbGoodsReceipts,
  dbSupplierInvoices,
  dbVendorPerformance,
  dbBlanketPurchaseOrders,
  dbVendorAudits,
  PurchaseRequisition,
  PurchaseOrder,
  GoodsReceipt,
  SupplierInvoice,
  RequestForQuotation,
  BlanketPurchaseOrder,
  VendorAuditRecord,
} from './procurementData.js';

export const procurementRouter = Router();

// GET /api/procurement/dashboard-metrics
procurementRouter.get('/procurement/dashboard-metrics', (req: Request, res: Response) => {
  const totalPrCount = dbPurchaseRequisitions.length;
  const pendingPrCount = dbPurchaseRequisitions.filter((pr) => pr.status === 'Submitted' || pr.status === 'Draft').length;
  const totalPoCount = dbPurchaseOrders.length;
  const activePoValueRp = dbPurchaseOrders.reduce((sum, po) => sum + po.grandTotalRp, 0);
  const pendingThreeWayMatch = dbSupplierInvoices.filter((inv) => inv.threeWayMatchStatus !== 'Matched').length;
  const avgVendorScore = (dbVendorPerformance.reduce((s, v) => s + v.overallVendorScore, 0) / (dbVendorPerformance.length || 1)).toFixed(1);
  const activeBpoCount = dbBlanketPurchaseOrders.filter((b) => b.status === 'Active').length;

  res.json({
    success: true,
    summary: {
      totalPrCount,
      pendingPrCount,
      totalPoCount,
      activePoValueRp,
      pendingThreeWayMatch,
      avgVendorScore,
      activeBpoCount,
    },
  });
});

// GET /api/procurement/blanket-orders
procurementRouter.get('/procurement/blanket-orders', (req: Request, res: Response) => {
  res.json({ success: true, count: dbBlanketPurchaseOrders.length, data: dbBlanketPurchaseOrders });
});

// POST /api/procurement/blanket-orders/call-off
procurementRouter.post('/procurement/blanket-orders/call-off', (req: Request, res: Response) => {
  const { bpoId, releaseQtyKg, warehouseCode, deliveryDate } = req.body;
  const bpo = dbBlanketPurchaseOrders.find((b) => b.id === bpoId);
  if (!bpo) {
    return res.status(404).json({ success: false, error: 'Blanket Purchase Order not found' });
  }

  const qty = Number(releaseQtyKg) || 100;
  if (qty > bpo.remainingQuantityKg) {
    return res.status(400).json({ success: false, error: 'Kuantitas release melebihi sisa kontrak BPO!' });
  }

  bpo.releasedQuantityKg += qty;
  bpo.remainingQuantityKg -= qty;
  if (bpo.remainingQuantityKg <= 0) {
    bpo.status = 'Fulfilled';
  }

  const subtotal = qty * bpo.contractedPricePerUnitRp;
  const tax = subtotal * 0.11;
  const grandTotal = subtotal + tax;

  const callOffPo: PurchaseOrder = {
    id: `po-${Date.now()}`,
    poNumber: `PO/CALL-OFF/2026/08/00${dbPurchaseOrders.length + 50}`,
    supplierCode: bpo.supplierCode,
    supplierName: bpo.supplierName,
    warehouseCode: warehouseCode || 'WH-RM-01',
    paymentTermDays: 30,
    shippingMethod: 'Land Cold Trucking',
    incoterms: 'DDP',
    expectedDeliveryDate: deliveryDate || '2026-08-25',
    items: [
      {
        id: `poit-${Date.now()}`,
        itemCode: bpo.itemCode,
        itemName: bpo.materialName,
        quantityOrdered: qty,
        quantityReceived: 0,
        unitPriceRp: bpo.contractedPricePerUnitRp,
        discountPct: 0,
        subtotalRp: subtotal,
      },
    ],
    subtotalRp: subtotal,
    taxPpnRp: tax,
    grandTotalRp: grandTotal,
    status: 'Approved',
    approvalHistory: [
      { role: 'Procurement Specialist', approverName: 'Auto Call-off BPO System', status: 'Approved', date: new Date().toISOString().split('T')[0] },
    ],
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbPurchaseOrders.unshift(callOffPo);

  res.json({
    success: true,
    message: `Call-Off PO sebesar ${qty} Kg berhasil diterbitkan dari Kontrak BPO ${bpo.contractNumber}!`,
    data: { bpo, newPo: callOffPo },
  });
});

// GET /api/procurement/vendor-audits
procurementRouter.get('/procurement/vendor-audits', (req: Request, res: Response) => {
  res.json({ success: true, count: dbVendorAudits.length, data: dbVendorAudits });
});

// POST /api/procurement/vendor-audits
procurementRouter.post('/procurement/vendor-audits', (req: Request, res: Response) => {
  const { supplierCode, supplierName, gmpCpkbStatus, halalStatus, bpomRawMaterialCode, coaCompliancePct } = req.body;
  const newAudit: VendorAuditRecord = {
    supplierCode: supplierCode || `SUP-NEW-${Date.now().toString().slice(-3)}`,
    supplierName: supplierName || 'Supplier Baru',
    gmpCpkbStatus: gmpCpkbStatus || 'CPKB / GMP Certified',
    halalStatus: halalStatus || 'Halal LPPOM MUI Certified',
    bpomRawMaterialCode: bpomRawMaterialCode || 'BPOM-RAW-PENDING',
    lastAuditDate: new Date().toISOString().split('T')[0],
    nextAuditDueDate: '2027-08-08',
    coaCompliancePct: Number(coaCompliancePct) || 98.0,
    qualificationStatus: 'Qualified (Preferred)',
  };

  dbVendorAudits.unshift(newAudit);
  res.status(201).json({ success: true, message: 'Vendor Audit & CPKB Qualification updated', data: newAudit });
});

// GET /api/procurement/purchase-requisitions
procurementRouter.get('/procurement/purchase-requisitions', (req: Request, res: Response) => {
  const { search } = req.query;
  let list = [...dbPurchaseRequisitions];
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (pr) =>
        pr.prNumber.toLowerCase().includes(q) ||
        pr.department.toLowerCase().includes(q) ||
        pr.requesterName.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, count: list.length, data: list });
});

// POST /api/procurement/purchase-requisitions
procurementRouter.post('/procurement/purchase-requisitions', (req: Request, res: Response) => {
  const { department, requesterName, requiredDate, priority, costCenter, items, totalBudgetRp } = req.body;
  const newPr: PurchaseRequisition = {
    id: `pr-${Date.now()}`,
    prNumber: `PR/PROC/2026/08/00${dbPurchaseRequisitions.length + 20}`,
    department: department || 'R&D Formulation',
    requesterName: requesterName || 'System User',
    requiredDate: requiredDate || '2026-08-25',
    priority: priority || 'High',
    costCenter: costCenter || 'CC-RD-LAB',
    items: items || [],
    totalBudgetRp: Number(totalBudgetRp) || 50000000,
    status: 'Submitted',
    approvalLevel: 'Pending Manager Review',
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbPurchaseRequisitions.unshift(newPr);
  res.status(201).json({ success: true, message: 'Purchase Requisition created successfully', data: newPr });
});

// PATCH /api/procurement/purchase-requisitions/:id/approve
procurementRouter.patch('/procurement/purchase-requisitions/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const pr = dbPurchaseRequisitions.find((p) => p.id === id);
  if (!pr) {
    return res.status(404).json({ success: false, error: 'PR not found' });
  }
  pr.status = 'Approved';
  pr.approvalLevel = 'VP Supply Chain Approved';
  res.json({ success: true, message: 'PR Approved', data: pr });
});

// GET /api/procurement/rfqs
procurementRouter.get('/procurement/rfqs', (req: Request, res: Response) => {
  res.json({ success: true, data: dbRfqs });
});

// POST /api/procurement/rfqs
procurementRouter.post('/procurement/rfqs', (req: Request, res: Response) => {
  const { prNumber, itemCode, itemName, quantityNeeded, deadlineDate, supplierQuotes } = req.body;
  const newRfq: RequestForQuotation = {
    id: `rfq-${Date.now()}`,
    rfqNumber: `RFQ/PROC/2026/08/00${dbRfqs.length + 90}`,
    prNumber: prNumber || 'PR/PROC/2026/08/0019',
    itemCode: itemCode || 'RM-ACT-005',
    itemName: itemName || 'Alpha Arbutin Powder Grade A',
    quantityNeeded: Number(quantityNeeded) || 100,
    deadlineDate: deadlineDate || '2026-08-30',
    supplierQuotes: supplierQuotes && supplierQuotes.length > 0 ? supplierQuotes : [
      {
        supplierCode: 'SUP-ID-001',
        supplierName: 'PT Chemical Nusantara Fine Ingredients',
        pricePerUnitRp: 820000,
        leadTimeDays: 7,
        moqUnits: 50,
        paymentTermDays: 30,
        qualityRatingScore: 98,
        deliveryPerformancePct: 96,
        status: 'Submitted',
      },
      {
        supplierCode: 'SUP-SG-002',
        supplierName: 'PureBio Ingredients Asia Pte Ltd',
        pricePerUnitRp: 840000,
        leadTimeDays: 10,
        moqUnits: 100,
        paymentTermDays: 45,
        qualityRatingScore: 96,
        deliveryPerformancePct: 94,
        status: 'Submitted',
      },
    ],
    status: 'Open',
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbRfqs.unshift(newRfq);
  res.status(201).json({ success: true, message: 'Request For Quotation (RFQ) created successfully', data: newRfq });
});

// POST /api/procurement/ai-chat
procurementRouter.post('/procurement/ai-chat', (req: Request, res: Response) => {
  const { message } = req.body;
  const msgLower = (message || '').toLowerCase();

  let reply = 'AI Procurement Assistant aktif. Saya dapat menganalisis tren harga bahan baku aktif, verifikasi dokumen Halal/CPKB supplier, sertakan rekomendasi Blanket Order, dan kalkulasi total cost of ownership (TCO).';

  if (msgLower.includes('harga') || msgLower.includes('niacinamide') || msgLower.includes('tren')) {
    reply = '📊 **Analisis Tren Harga & Pasar Raw Material:**\n- **Niacinamide USP Grade**: Proyeksi kenaikan harga +3.2% bulan depan karena keterbatasan pasokan impor. Direkomendasikan menambah **Blanket Purchase Order 1.000 Kg** ke PT Chemical Nusantara untuk mengunci harga diskon Rp 170.000/Kg (Hemat Rp 8.000.000).\n- **Hyaluronic Acid Powder**: Harga stabil Rp 1.150.000/Kg dengan lead time 14 hari dari Singapura.';
  } else if (msgLower.includes('supplier') || msgLower.includes('vendor') || msgLower.includes('cpkb') || msgLower.includes('halal')) {
    reply = '🛡️ **Status Kualifikasi Vendor CPKB & Halal:**\n1. **PT Chemical Nusantara**: CPKB Certified, Sertifikat Halal LPPOM MUI Aktif (s/d Feb 2027), Rating Quality Score 99.0% (Class A Preferred).\n2. **PureBio Ingredients Asia**: ISO 22716 Certified, Status Import Clearance Smooth.\n3. **PT Packaging Indah**: Status *Under Audit* - Perlu melengkapi Sertifikat Bebas Bisphenol A (BPA Free) untuk botol toner.';
  } else if (msgLower.includes('3-way') || msgLower.includes('invoice') || msgLower.includes('match') || msgLower.includes('selisih')) {
    reply = '🧾 **3-Way Matching Verification Status:**\n- Semua PO dan GRN bulan Agustus 2026 telah sesuai 100% (Matched) tanpa selisih harga atau kuantitas.\n- Total tagihan Rp 95.182.500 dijadwalkan cair pada 5 September 2026 sesuai Payment Term 30 hari (TOP).';
  } else if (msgLower.includes('rfq') || msgLower.includes('po') || msgLower.includes('order')) {
    reply = '⚡ **Rekomendasi Tindakan Pengadaan:**\n- **RFQ/PROC/2026/08/0088**: Penawaran terbaik dimenangkan oleh *PT Chemical Nusantara* (Rp 175.000/Kg, Lead Time 7 Hari).\n- Disarankan konfirmasi pembukaan PO untuk PR/PROC/2026/08/0020 (Botol Pipet Kaca Amber 25.000 Pcs).';
  }

  res.json({ success: true, reply });
});

// GET /api/procurement/purchase-orders
procurementRouter.get('/procurement/purchase-orders', (req: Request, res: Response) => {
  res.json({ success: true, data: dbPurchaseOrders });
});

// POST /api/procurement/purchase-orders/convert-from-rfq
procurementRouter.post('/procurement/purchase-orders/convert-from-rfq', (req: Request, res: Response) => {
  const { rfqId, supplierCode } = req.body;
  const rfq = dbRfqs.find((r) => r.id === rfqId);
  const quote = rfq?.supplierQuotes.find((q) => q.supplierCode === supplierCode);

  if (!rfq || !quote) {
    return res.status(400).json({ success: false, error: 'Invalid RFQ or Supplier Selection' });
  }

  const subtotal = quote.pricePerUnitRp * rfq.quantityNeeded;
  const tax = subtotal * 0.11;
  const grandTotal = subtotal + tax;

  const newPo: PurchaseOrder = {
    id: `po-${Date.now()}`,
    poNumber: `PO/CPKB/2026/08/00${dbPurchaseOrders.length + 46}`,
    rfqNumber: rfq.rfqNumber,
    prNumber: rfq.prNumber,
    supplierCode: quote.supplierCode,
    supplierName: quote.supplierName,
    warehouseCode: 'WH-RM-01',
    paymentTermDays: quote.paymentTermDays,
    shippingMethod: 'Land Cold Trucking',
    incoterms: 'DDP',
    expectedDeliveryDate: '2026-08-20',
    items: [
      {
        id: `poit-${Date.now()}`,
        itemCode: rfq.itemCode,
        itemName: rfq.itemName,
        quantityOrdered: rfq.quantityNeeded,
        quantityReceived: 0,
        unitPriceRp: quote.pricePerUnitRp,
        discountPct: 0,
        subtotalRp: subtotal,
      },
    ],
    subtotalRp: subtotal,
    taxPpnRp: tax,
    grandTotalRp: grandTotal,
    status: 'Sent to Supplier',
    approvalHistory: [
      { role: 'Procurement Manager', approverName: 'Hendra Setiawan', status: 'Approved', date: new Date().toISOString().split('T')[0] },
    ],
    createdDate: new Date().toISOString().split('T')[0],
  };

  dbPurchaseOrders.unshift(newPo);
  rfq.status = 'Closed';

  res.json({ success: true, message: 'Purchase Order generated from RFQ successfully', data: newPo });
});

// GET /api/procurement/goods-receipts
procurementRouter.get('/procurement/goods-receipts', (req: Request, res: Response) => {
  res.json({ success: true, data: dbGoodsReceipts });
});

// POST /api/procurement/goods-receipts
procurementRouter.post('/procurement/goods-receipts', (req: Request, res: Response) => {
  const { poNumber, deliveryNoteNumber, receivedBy, items } = req.body;
  const newGrn: GoodsReceipt = {
    id: `grn-${Date.now()}`,
    grnNumber: `GRN/WH/2026/08/010${dbGoodsReceipts.length + 3}`,
    poNumber: poNumber || 'PO/CPKB/2026/08/0045',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    deliveryNoteNumber: deliveryNoteNumber || 'SJ-SUPP-99120',
    receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    receivedBy: receivedBy || 'Warehouse Staff',
    warehouseCode: 'WH-RM-01 (Quarantine Zone)',
    items: items || [],
    overallQcStatus: 'QC Hold Inspection',
  };

  dbGoodsReceipts.unshift(newGrn);
  res.status(201).json({ success: true, message: 'Goods Receipt Note created (QC Hold)', data: newGrn });
});

// GET /api/procurement/supplier-invoices
procurementRouter.get('/procurement/supplier-invoices', (req: Request, res: Response) => {
  res.json({ success: true, data: dbSupplierInvoices });
});

// POST /api/procurement/three-way-match
procurementRouter.post('/procurement/three-way-match', (req: Request, res: Response) => {
  const { invoiceId } = req.body;
  const inv = dbSupplierInvoices.find((i) => i.id === invoiceId);
  if (!inv) {
    return res.status(404).json({ success: false, error: 'Invoice not found' });
  }

  // Check matching logic
  if (inv.poAmountRp === inv.grnAmountRp && inv.grnAmountRp === inv.invoiceAmountRp) {
    inv.threeWayMatchStatus = 'Matched';
    inv.paymentStatus = 'Scheduled';
  } else {
    inv.threeWayMatchStatus = 'Price Discrepancy';
  }

  res.json({ success: true, message: 'Three-Way Match Verification Completed', data: inv });
});

// GET /api/procurement/vendor-performance
procurementRouter.get('/procurement/vendor-performance', (req: Request, res: Response) => {
  res.json({ success: true, data: dbVendorPerformance });
});

// GET /api/procurement/ai-insights
procurementRouter.get('/procurement/ai-insights', (req: Request, res: Response) => {
  res.json({
    success: true,
    insights: {
      priceForecast: [
        { item: 'Niacinamide 99%', trend: '+3.2% Projected Next Month', risk: 'Medium', suggestion: 'Beli blanket order 1,000 kg untuk lock harga diskon 5%.' },
        { item: 'Hyaluronic Acid Powder', trend: '-1.5% Stable Import Stream', risk: 'Low', suggestion: 'Disarankan MOQ 50kg reguler.' },
      ],
      vendorRiskAlerts: [
        { supplierName: 'PT Global Packaging Plastics', issue: 'Delay rata-rata 3.5 hari pada kemasan pot akrilik', mitigation: 'Alokasikan 30% order ke supplier sekunder.' },
      ],
      safetyStockOptimizations: [
        { rawMaterial: 'AHA Glycolic Acid 70%', currentStockKg: 120, recommendedSafetyStockKg: 200, actionRequired: 'Issue PR Segera' },
      ],
    },
  });
});
