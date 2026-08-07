import { Router, Request, Response } from 'express';
import {
  dbPurchaseRequisitions,
  dbRfqs,
  dbPurchaseOrders,
  dbGoodsReceipts,
  dbSupplierInvoices,
  dbVendorPerformance,
  PurchaseRequisition,
  PurchaseOrder,
  GoodsReceipt,
  SupplierInvoice,
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

  res.json({
    success: true,
    summary: {
      totalPrCount,
      pendingPrCount,
      totalPoCount,
      activePoValueRp,
      pendingThreeWayMatch,
      avgVendorScore,
    },
  });
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
