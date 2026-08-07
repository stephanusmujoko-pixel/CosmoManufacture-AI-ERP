import { Router, Request, Response } from 'express';
import {
  dbProducts,
  dbRawMaterials,
  dbSuppliers,
  dbCustomers,
  dbMachines,
  dbWarehouses,
  dbDocumentFormats,
  dbApprovalRules,
  dbAuditLogs,
  MasterProduct,
  MasterRawMaterial,
  MasterSupplier,
  MasterCustomer,
  MasterMachine,
  MasterWarehouseLocation,
} from './masterData.js';

export const masterRouter = Router();

// Middleware: Extract tenant info & Audit logger
masterRouter.use((req, res, next) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 't-cosmo-01';
  (req as any).tenantId = tenantId;
  next();
});

const logAudit = (
  tenantId: string,
  userEmail: string,
  userName: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'APPROVE' | 'REJECT',
  entityType: 'Product' | 'Raw Material' | 'Supplier' | 'Customer' | 'Machine' | 'Warehouse' | 'Approval',
  entityId: string,
  entityName: string,
  details: string
) => {
  dbAuditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    tenantId,
    userEmail,
    userName,
    action,
    entityType,
    entityId,
    entityName,
    details,
    ipAddress: '127.0.0.1',
  });
};

// 1. PRODUCTS MASTER CRUD
masterRouter.get('/products', (req: Request, res: Response) => {
  const { search, category, type, status } = req.query;
  let result = [...dbProducts];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.bpomNumber.toLowerCase().includes(q)
    );
  }

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (type) {
    result = result.filter((p) => p.type === type);
  }

  if (status) {
    result = result.filter((p) => p.status === status);
  }

  return res.json({
    success: true,
    totalRecords: result.length,
    data: result,
  });
});

masterRouter.post('/products', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const body = req.body;

  if (!body.productName || !body.sku) {
    return res.status(400).json({ success: false, message: 'Nama produk dan SKU wajib diisi.' });
  }

  const newProduct: MasterProduct = {
    id: `prod-${Date.now()}`,
    sku: body.sku,
    barcode: body.barcode || `899${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    qrCode: `QR-${body.sku}`,
    productCode: body.productCode || `FG-${Date.now().toString().slice(-4)}`,
    productName: body.productName,
    brand: body.brand || 'CosmoManufacture Brand',
    category: body.category || 'Skincare',
    type: body.type || 'Finished Goods',
    formulaCode: body.formulaCode || 'FORM-NEW-2026',
    formulaVersion: body.formulaVersion || '1.0',
    packagingType: body.packagingType || 'Botol Glass 30ml',
    netto: body.netto || '30 ml',
    grossWeightGrams: body.grossWeightGrams || 80,
    volumeMl: body.volumeMl || 30,
    color: body.color || 'Clear',
    fragrance: body.fragrance || 'Unscented',
    variant: body.variant || 'Standard',
    shelfLifeMonths: body.shelfLifeMonths || 24,
    bpomNumber: body.bpomNumber || `NA${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    bpomExpiry: body.bpomExpiry || '2029-12-31',
    halalNumber: body.halalNumber || 'ID00410000288100999',
    status: body.status || 'active',
    targetPh: body.targetPh || '5.5 - 6.5',
    viscosityCps: body.viscosityCps || '1,000 cPs',
    densityGml: body.densityGml || 1.0,
    createdDate: new Date().toISOString().split('T')[0],
    tags: body.tags || ['BPOM-Pending'],
    attachments: body.attachments || [],
  };

  dbProducts.unshift(newProduct);

  logAudit(
    tenantId,
    'admin@paragonia.co.id',
    'Super Admin ERP',
    'CREATE',
    'Product',
    newProduct.id,
    newProduct.productName,
    `Menambahkan produk baru ke database master: SKU ${newProduct.sku}, BPOM ${newProduct.bpomNumber}`
  );

  return res.status(201).json({
    success: true,
    message: 'Master Product berhasil didaftarkan.',
    data: newProduct,
  });
});

// 2. RAW MATERIALS MASTER CRUD
masterRouter.get('/raw-materials', (req: Request, res: Response) => {
  const { search, category, status } = req.query;
  let result = [...dbRawMaterials];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (rm) =>
        rm.name.toLowerCase().includes(q) ||
        rm.code.toLowerCase().includes(q) ||
        rm.casNumber.toLowerCase().includes(q) ||
        rm.scientificName.toLowerCase().includes(q) ||
        rm.supplierName.toLowerCase().includes(q)
    );
  }

  if (category) {
    result = result.filter((rm) => rm.category === category);
  }

  if (status) {
    result = result.filter((rm) => rm.status === status);
  }

  return res.json({
    success: true,
    totalRecords: result.length,
    data: result,
  });
});

masterRouter.post('/raw-materials', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const body = req.body;

  if (!body.name || !body.code) {
    return res.status(400).json({ success: false, message: 'Nama bahan baku dan kode wajib diisi.' });
  }

  const newRm: MasterRawMaterial = {
    id: `rm-${Date.now()}`,
    code: body.code,
    name: body.name,
    scientificName: body.scientificName || body.name,
    casNumber: body.casNumber || '0000-00-0',
    category: body.category || 'Active Ingredient',
    supplierName: body.supplierName || 'PT General Chemical',
    countryOfOrigin: body.countryOfOrigin || 'Indonesia',
    grade: body.grade || 'Cosmetic Grade',
    purityPercentage: body.purityPercentage || 99.0,
    storageCondition: body.storageCondition || 'Cool & Dry (15-25°C)',
    hazardLevel: body.hazardLevel || 'None',
    msdsFileName: body.msdsFileName || 'MSDS_Default.pdf',
    coaStandard: body.coaStandard || 'CPKB Standard',
    shelfLifeMonths: body.shelfLifeMonths || 24,
    leadTimeDays: body.leadTimeDays || 14,
    moqKg: body.moqKg || 10,
    safetyStockKg: body.safetyStockKg || 50,
    reorderPointKg: body.reorderPointKg || 100,
    pricePerKgRp: body.pricePerKgRp || 150000,
    halalCertified: body.halalCertified ?? true,
    bpomAllowedMaxPct: body.bpomAllowedMaxPct || 5.0,
    status: body.status || 'active',
  };

  dbRawMaterials.unshift(newRm);

  logAudit(
    tenantId,
    'rd.chemist@paragonia.co.id',
    'Senior Chemist R&D',
    'CREATE',
    'Raw Material',
    newRm.id,
    newRm.name,
    `Mendaftarkan Bahan Baku Kosmetik Baru: CAS ${newRm.casNumber}, Supplier ${newRm.supplierName}`
  );

  return res.status(201).json({
    success: true,
    message: 'Master Bahan Baku Kosmetik berhasil didaftarkan.',
    data: newRm,
  });
});

// 3. SUPPLIERS MASTER CRUD
masterRouter.get('/suppliers', (req: Request, res: Response) => {
  const { search, approvedOnly } = req.query;
  let result = [...dbSuppliers];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.supplierCode.toLowerCase().includes(q) ||
        s.picName.toLowerCase().includes(q)
    );
  }

  if (approvedOnly === 'true') {
    result = result.filter((s) => s.isApprovedVendor);
  }

  return res.json({
    success: true,
    totalRecords: result.length,
    data: result,
  });
});

// 4. CUSTOMERS MASTER CRUD
masterRouter.get('/customers', (req: Request, res: Response) => {
  const { search } = req.query;
  let result = [...dbCustomers];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.brandName.toLowerCase().includes(q) ||
        c.picName.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    totalRecords: result.length,
    data: result,
  });
});

// 5. MACHINES MASTER CRUD
masterRouter.get('/machines', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalRecords: dbMachines.length,
    data: dbMachines,
  });
});

// 6. WAREHOUSES MASTER CRUD
masterRouter.get('/warehouses', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalRecords: dbWarehouses.length,
    data: dbWarehouses,
  });
});

// 7. AUTO DOCUMENT NUMBERING ENGINE
masterRouter.get('/document-numbering', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: dbDocumentFormats,
  });
});

masterRouter.post('/document-numbering/generate', (req: Request, res: Response) => {
  const { docType } = req.body;
  const fmt = dbDocumentFormats.find((f) => f.docType === docType);

  if (!fmt) {
    return res.status(404).json({ success: false, message: 'Format penomoran dokumen tidak ditemukan.' });
  }

  fmt.currentSequence += 1;
  const seqStr = String(fmt.currentSequence).padStart(fmt.digits, '0');
  const generatedNumber = `${fmt.prefix}${seqStr}${fmt.suffix}`;
  fmt.sampleResult = generatedNumber;

  return res.json({
    success: true,
    docType,
    generatedNumber,
    currentSequence: fmt.currentSequence,
  });
});

// 8. AUDIT TRAIL LOGS
masterRouter.get('/audit-logs', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalLogs: dbAuditLogs.length,
    data: dbAuditLogs,
  });
});

// 9. MASTER DATA OVERVIEW DASHBOARD METRICS
masterRouter.get('/dashboard-metrics', (req: Request, res: Response) => {
  return res.json({
    success: true,
    summary: {
      totalProducts: dbProducts.length,
      totalRawMaterials: dbRawMaterials.length,
      totalSuppliers: dbSuppliers.length,
      totalCustomers: dbCustomers.length,
      totalMachines: dbMachines.length,
      totalWarehouses: dbWarehouses.length,
      totalDocumentRules: dbDocumentFormats.length,
      totalAuditLogs: dbAuditLogs.length,
      bpomCompliantPct: 100,
      halalCertifiedPct: 100,
      cpkbGradeStatus: 'Class A Certified',
    },
  });
});
