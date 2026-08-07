import { Router, Request, Response } from 'express';
import {
  dbTenantsSaas,
  dbLicenses,
  dbInvoices,
  SUBSCRIPTION_PLANS,
  FEATURE_FLAGS,
  dbQuotas,
} from './saasData.js';

export const saasRouter = Router();

// Middleware: Validate tenant header
saasRouter.use((req, res, next) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 't-cosmo-01';
  (req as any).tenantId = tenantId;
  next();
});

// 1. GET & POST /api/tenants
saasRouter.get('/tenants', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalTenants: dbTenantsSaas.length,
    data: dbTenantsSaas,
  });
});

saasRouter.post('/tenants', (req: Request, res: Response) => {
  const { name, brand, email, phone, whatsapp, npwp, nib, planCode } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Nama perusahaan dan email wajib diisi.' });
  }

  const newId = `t-tenant-${Date.now().toString().slice(-4)}`;
  const licenseKey = `COSMO-${(planCode || 'STR').toUpperCase().slice(0, 3)}-2026-${Math.random().toString(36).substring(7).toUpperCase()}-SIGN`;

  const newTenant = {
    id: newId,
    name,
    brand: brand || name,
    email,
    phone: phone || '-',
    whatsapp: whatsapp || '-',
    website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.id`,
    npwp: npwp || '00.000.000.0-000.000',
    nib: nib || '9120000000000',
    status: 'active' as const,
    planCode: planCode || 'starter',
    currentLicenseKey: licenseKey,
    createdAt: new Date().toISOString(),
    joinedDate: new Date().toISOString().split('T')[0],
  };

  dbTenantsSaas.unshift(newTenant);

  // Auto create quota entry
  dbQuotas[newId] = {
    tenantId: newId,
    usersUsed: 1,
    usersLimit: planCode === 'enterprise' ? 250 : planCode === 'professional' ? 50 : 10,
    storageGbUsed: 0.1,
    storageGbLimit: planCode === 'enterprise' ? 1000 : planCode === 'professional' ? 250 : 50,
    aiRequestsUsed: 0,
    aiRequestsLimit: planCode === 'enterprise' ? 10000000 : planCode === 'professional' ? 2500000 : 500000,
    apiCallsUsed: 0,
    apiCallsLimit: planCode === 'enterprise' ? 1000000 : planCode === 'professional' ? 250000 : 50000,
    warehousesUsed: 1,
    warehousesLimit: planCode === 'enterprise' ? 20 : planCode === 'professional' ? 5 : 2,
    factoriesUsed: 1,
    factoriesLimit: planCode === 'enterprise' ? 5 : planCode === 'professional' ? 2 : 1,
  };

  return res.status(201).json({
    success: true,
    message: 'Tenant SaaS berhasil dibuat dengan isolasi data terpisah.',
    data: newTenant,
  });
});

// 2. GET /api/plans
saasRouter.get('/plans', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: SUBSCRIPTION_PLANS,
  });
});

// 3. GET /api/licenses & POST /api/license/activate & /api/license/renew
saasRouter.get('/licenses', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const filtered = dbLicenses.filter((l) => l.tenantId === tenantId || tenantId === 'all');

  return res.json({
    success: true,
    tenantId,
    data: filtered,
  });
});

saasRouter.post('/license/activate', (req: Request, res: Response) => {
  const { licenseKey, hardwareHash, domainName } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ success: false, message: 'License key tidak boleh kosong.' });
  }

  const lic = dbLicenses.find((l) => l.licenseKey === licenseKey);

  if (lic) {
    lic.status = 'active';
    lic.hardwareBindingHash = hardwareHash || lic.hardwareBindingHash;
    lic.domainBinding = domainName || lic.domainBinding;
    lic.activationDate = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Aktivasi License Key Berhasil. Terikat pada Hardware Fingerprint & Domain.',
      data: lic,
    });
  }

  return res.status(404).json({
    success: false,
    message: 'License key tidak ditemukan di server registri SaaS.',
  });
});

saasRouter.post('/license/renew', (req: Request, res: Response) => {
  const { licenseKey, extendYears } = req.body;
  const lic = dbLicenses.find((l) => l.licenseKey === licenseKey);

  if (lic) {
    const currentExp = new Date(lic.expiryDate);
    currentExp.setFullYear(currentExp.getFullYear() + (extendYears || 1));
    lic.expiryDate = currentExp.toISOString();
    lic.status = 'active';

    return res.json({
      success: true,
      message: `Perpanjangan lisensi berhasil hingga ${lic.expiryDate.split('T')[0]}.`,
      data: lic,
    });
  }

  return res.status(404).json({ success: false, message: 'Lisensi tidak terdaftar.' });
});

// 4. GET & POST /api/invoices
saasRouter.get('/invoices', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const invoices = dbInvoices.filter((i) => i.tenantId === tenantId || tenantId === 'all');

  return res.json({
    success: true,
    totalInvoices: invoices.length,
    data: invoices,
  });
});

saasRouter.post('/invoices', (req: Request, res: Response) => {
  const { tenantId, planCode, billingCycle } = req.body;
  const targetTenant = dbTenantsSaas.find((t) => t.id === tenantId) || dbTenantsSaas[0];
  const plan = SUBSCRIPTION_PLANS.find((p) => p.code === planCode) || SUBSCRIPTION_PLANS[1];

  const isYearly = billingCycle === 'yearly';
  const subtotal = isYearly ? plan.priceYearly : plan.priceMonthly;
  const taxPpn = subtotal * 0.11;
  const discount = isYearly ? subtotal * 0.1 : 0;
  const grandTotal = subtotal + taxPpn - discount;

  const newInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV/SAAS/2026/${new Date().getMonth() + 1}/00${dbInvoices.length + 1}`,
    tenantId: targetTenant.id,
    tenantName: targetTenant.name,
    planName: `${plan.name} (${isYearly ? 'Yearly' : 'Monthly'})`,
    period: `${new Date().toLocaleDateString('id-ID')} - ${new Date(
      Date.now() + (isYearly ? 365 : 30) * 86400000
    ).toLocaleDateString('id-ID')}`,
    subtotal,
    taxPpn,
    discount,
    grandTotal,
    status: 'unpaid' as const,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  };

  dbInvoices.unshift(newInvoice);

  return res.status(201).json({
    success: true,
    message: 'Invoice tagihan SaaS berhasil diterbitkan.',
    data: newInvoice,
  });
});

// 5. POST /api/payments (Payment Gateway Adapter)
saasRouter.post('/payments', (req: Request, res: Response) => {
  const { invoiceNumber, paymentChannel, provider } = req.body;

  const inv = dbInvoices.find((i) => i.invoiceNumber === invoiceNumber || i.id === invoiceNumber);

  if (!inv) {
    return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan.' });
  }

  inv.status = 'paid';
  inv.paidDate = new Date().toISOString();
  inv.paymentMethod = `${paymentChannel || 'BCA Virtual Account'} (${provider || 'Midtrans'})`;
  inv.gatewayProvider = provider || 'midtrans';

  return res.json({
    success: true,
    message: `Pembayaran invoice ${inv.invoiceNumber} berhasil diproses via ${inv.gatewayProvider?.toUpperCase()}. License diperpanjang otomatis.`,
    data: {
      transactionId: `TRX-${Date.now()}`,
      invoiceNumber: inv.invoiceNumber,
      amountPaid: inv.grandTotal,
      paidAt: inv.paidDate,
      paymentMethod: inv.paymentMethod,
    },
  });
});

// 6. GET /api/payment-methods
saasRouter.get('/payment-methods', (req: Request, res: Response) => {
  return res.json({
    success: true,
    gateways: [
      { id: 'midtrans', name: 'Midtrans Payment Gateway', channels: ['BCA VA', 'Mandiri VA', 'BRI VA', 'QRIS', 'Gopay', 'ShopeePay'] },
      { id: 'xendit', name: 'Xendit Payments', channels: ['BNI VA', 'Permata VA', 'Credit Card', 'OVO', 'Dana'] },
      { id: 'doku', name: 'DOKU Aggregator', channels: ['DOKU Wallet', 'AlfaGroup', 'Indomaret'] },
      { id: 'stripe', name: 'Stripe Global Card Engine', channels: ['Visa', 'Mastercard', 'American Express'] },
      { id: 'manual', name: 'Manual Transfer Verifikasi Apoteker/Admin', channels: ['Transfer Bank BCA (Cek Manual)'] },
    ],
  });
});

// 7. GET /api/feature-flags
saasRouter.get('/feature-flags', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const tenant = dbTenantsSaas.find((t) => t.id === tenantId) || dbTenantsSaas[0];
  const planCode = tenant.planCode;

  const flagsWithStatus = FEATURE_FLAGS.map((ff) => ({
    ...ff,
    isEnabledForTenant:
      planCode === 'enterprise'
        ? ff.enabledInEnterprise
        : planCode === 'professional'
        ? ff.enabledInProfessional
        : ff.enabledInStarter,
  }));

  return res.json({
    success: true,
    tenantId,
    planCode,
    data: flagsWithStatus,
  });
});

// 8. GET /api/quota
saasRouter.get('/quota', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId;
  const quota = dbQuotas[tenantId] || dbQuotas['t-cosmo-01'];

  return res.json({
    success: true,
    data: quota,
  });
});

// 9. GET /api/superadmin/metrics (Super Admin Portal Analytics)
saasRouter.get('/superadmin/metrics', (req: Request, res: Response) => {
  const totalTenants = dbTenantsSaas.length;
  const activeTenants = dbTenantsSaas.filter((t) => t.status === 'active').length;
  const totalRevenue = dbInvoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.grandTotal, 0);

  // MRR calculation based on active plans
  const mrr = dbTenantsSaas
    .filter((t) => t.status === 'active')
    .reduce((sum, t) => {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.code === t.planCode);
      return sum + (plan ? plan.priceMonthly : 0);
    }, 0);

  const arr = mrr * 12;

  return res.json({
    success: true,
    summary: {
      totalTenants,
      activeTenants,
      trialTenants: dbTenantsSaas.filter((t) => t.status === 'trial').length,
      mrr,
      arr,
      totalRevenue,
      churnRatePercentage: 1.2, // Low churn
      renewalRatePercentage: 98.8,
      avgStorageUsageGb: 113.7,
      totalAiTokensConsumedMonthly: 11850000,
    },
    plansBreakdown: SUBSCRIPTION_PLANS.map((p) => ({
      planCode: p.code,
      planName: p.name,
      tenantsCount: dbTenantsSaas.filter((t) => t.planCode === p.code).length,
    })),
  });
});

// ==========================================
// 10. WHITE LABELING API (PROMPT 20)
// ==========================================
let whiteLabelConfig = {
  logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop',
  faviconUrl: '/favicon.ico',
  companyName: 'PT Beauty Glow Indonesia',
  brandName: 'CosmoManufacture Enterprise',
  primaryColor: '#059669', // Emerald 600
  secondaryColor: '#0f172a', // Slate 900
  typography: 'Inter / Plus Jakarta Sans',
  emailHeaderTemplate: 'Halo Tim {{companyName}}, Berikut laporan resmi dari CosmoManufacture AI ERP.',
  loginBackgroundUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=800&fit=crop',
  dashboardTheme: 'Dark Emerald Gold',
};

saasRouter.get('/white-label', (req: Request, res: Response) => {
  res.json({ success: true, data: whiteLabelConfig });
});

saasRouter.put('/white-label', (req: Request, res: Response) => {
  const { companyName, brandName, primaryColor, secondaryColor, dashboardTheme } = req.body;

  if (companyName) whiteLabelConfig.companyName = companyName;
  if (brandName) whiteLabelConfig.brandName = brandName;
  if (primaryColor) whiteLabelConfig.primaryColor = primaryColor;
  if (secondaryColor) whiteLabelConfig.secondaryColor = secondaryColor;
  if (dashboardTheme) whiteLabelConfig.dashboardTheme = dashboardTheme;

  res.json({
    success: true,
    message: 'Pengaturan White Label & Branding Tenant berhasil diperbarui.',
    data: whiteLabelConfig,
  });
});

// ==========================================
// 11. MARKETPLACE & PLUGIN SYSTEM API (PROMPT 20)
// ==========================================
const dbAddonsAndPlugins = [
  { id: 'plug-01', code: 'addon-whatsapp', name: 'WhatsApp Business API Automated Dispatch', category: 'Notification', priceMonthly: 1500000, installed: true, rating: 4.9 },
  { id: 'plug-02', code: 'addon-bpom-auto', name: 'e-BPOM Auto Sync & Digital Signature Verification', category: 'Regulatory', priceMonthly: 3500000, installed: true, rating: 5.0 },
  { id: 'plug-03', code: 'addon-plc-siemens', name: 'Siemens S7-1500 PLC Cleanroom OPC-UA Connector', category: 'MES IoT', priceMonthly: 5000000, installed: true, rating: 4.8 },
  { id: 'plug-04', code: 'addon-ai-pack', name: 'AI Chemist Specialized Prompt Pack (100+ Formulas)', category: 'AI Tools', priceMonthly: 2500000, installed: false, rating: 4.9 },
  { id: 'plug-05', code: 'addon-custom-dashboard', name: 'Executive C-Suite Financial Dashboard Pack', category: 'BI Analytics', priceMonthly: 2000000, installed: false, rating: 4.7 },
];

saasRouter.get('/marketplace/items', (req: Request, res: Response) => {
  res.json({ success: true, count: dbAddonsAndPlugins.length, data: dbAddonsAndPlugins });
});

saasRouter.post('/marketplace/toggle', (req: Request, res: Response) => {
  const { id } = req.body;
  const item = dbAddonsAndPlugins.find((p) => p.id === id);
  if (item) {
    item.installed = !item.installed;
    return res.json({
      success: true,
      message: `Plugin/Addon "${item.name}" ${item.installed ? 'berhasil diinstal' : 'dinonaktifkan'}.`,
      data: item,
    });
  }
  res.status(404).json({ success: false, message: 'Item tidak ditemukan.' });
});

// ==========================================
// 12. NOTIFICATION CENTER API (PROMPT 20)
// ==========================================
const dbNotificationsList = [
  { id: 'notif-01', timestamp: '2026-08-07 09:15', type: 'LICENSE', title: 'Perpanjangan Lisensi Sukses', content: 'Lisensi Enterprise PT Beauty Glow telah terverifikasi hingga Ags 2027.', status: 'unread' },
  { id: 'notif-02', timestamp: '2026-08-07 08:30', type: 'SYSTEM', title: 'Backup Otomatis Selesai', content: 'Database PostgreSQL & Tenant Media berhasil dicadangkan ke Cloud Storage.', status: 'read' },
  { id: 'notif-03', timestamp: '2026-08-06 17:45', type: 'SECURITY', title: 'Akses Baru Terdeteksi', content: 'Login Super Admin dari IP 180.252.12.88 (Jakarta, ID).', status: 'read' },
];

saasRouter.get('/notifications', (req: Request, res: Response) => {
  res.json({ success: true, data: dbNotificationsList });
});

// ==========================================
// 13. SYSTEM MONITORING & HEALTH CHECKS (PROMPT 20)
// ==========================================
saasRouter.get('/monitoring/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      server: {
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        cpuLoadPct: '4.2%',
      },
      services: {
        databasePostgres: { status: 'OPERATIONAL', latencyMs: 1.8, poolActive: 12 },
        redisCache: { status: 'OPERATIONAL', hitRatioPct: 96.4 },
        cloudRunContainer: { status: 'RUNNING', instanceCount: 3 },
        aiGeminiGateway: { status: 'OPERATIONAL', avgResponseTimeMs: 420 },
        queueRabbitMq: { status: 'OPERATIONAL', pendingJobs: 0 },
      },
    },
  });
});

saasRouter.get('/monitoring/logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: [
      { timestamp: new Date().toISOString(), level: 'INFO', module: 'AUTH', message: 'JWT token validated for tenant t-cosmo-01' },
      { timestamp: new Date().toISOString(), level: 'INFO', module: 'MES', message: 'Batch MES-2026-0801 telemetry synchronized' },
      { timestamp: new Date().toISOString(), level: 'INFO', module: 'SAAS', message: 'License heartbeat ping OK' },
    ],
  });
});

// ==========================================
// 14. BACKUP & RESTORE API (PROMPT 20)
// ==========================================
const dbBackupJobs = [
  { id: 'bak-01', filename: 'cosmo_erp_backup_full_20260807.sql.gz', sizeMb: 248.5, createdAt: '2026-08-07 02:00:00', type: 'Automated Daily', status: 'Completed' },
  { id: 'bak-02', filename: 'cosmo_erp_backup_incremental_20260806.sql.gz', sizeMb: 42.1, createdAt: '2026-08-06 02:00:00', type: 'Incremental', status: 'Completed' },
];

saasRouter.get('/backup/jobs', (req: Request, res: Response) => {
  res.json({ success: true, data: dbBackupJobs });
});

saasRouter.post('/backup/trigger', (req: Request, res: Response) => {
  const newBackup = {
    id: `bak-${Date.now()}`,
    filename: `cosmo_erp_backup_manual_${Date.now()}.sql.gz`,
    sizeMb: 252.0,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    type: 'Manual On-Demand',
    status: 'Completed',
  };
  dbBackupJobs.unshift(newBackup);
  res.json({ success: true, message: 'Backup database SaaS berhasil dibuat.', data: newBackup });
});

// ==========================================
// 15. AUDIT CENTER API (PROMPT 20)
// ==========================================
const dbAuditLogs = [
  { id: 'aud-01', timestamp: '2026-08-07 09:30:12', user: 'stephanus@cosmomanufacture.ai', role: 'Super Admin', action: 'LICENSE_ACTIVATE', tenant: 'PT Beauty Glow Indonesia', details: 'Aktivasi License Key COSMO-PRO-2026-BG8812-SIGN' },
  { id: 'aud-02', timestamp: '2026-08-07 08:45:00', user: 'admin@beautyglow.co.id', role: 'Tenant Admin', action: 'WHITE_LABEL_UPDATE', tenant: 'PT Beauty Glow Indonesia', details: 'Memperbarui skema warna primary ke Emerald' },
  { id: 'aud-03', timestamp: '2026-08-06 16:20:10', user: 'finance@paragonia.co.id', role: 'Finance Mgr', action: 'INVOICE_PAYMENT', tenant: 'PT Paragonia Cosmetic', details: 'Pembayaran Invoice INV/SAAS/2026/08/002 via Xendit' },
];

saasRouter.get('/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, data: dbAuditLogs });
});

// ==========================================
// 16. OPENAPI / SWAGGER DOCUMENTATION (PROMPT 20)
// ==========================================
saasRouter.get('/openapi.json', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'CosmoManufacture AI ERP SaaS Enterprise REST API',
      version: '1.0.0-PROMPT20',
      description: 'Dokumentasi REST API Lengkap CosmoManufacture AI ERP (Prompt 1 s/d Prompt 20)',
    },
    paths: {
      '/api/auth/login': { post: { summary: 'User Authentication JWT' } },
      '/api/tenants': { get: { summary: 'List Multi-Tenant SaaS' }, post: { summary: 'Provision Tenant' } },
      '/api/licenses': { get: { summary: 'List Licenses' } },
      '/api/license/validate': { post: { summary: 'Validate & Heartbeat License' } },
      '/api/billing/invoices': { get: { summary: 'List Invoices & Billing' } },
      '/api/payments': { post: { summary: 'Payment Gateway Webhook/Process' } },
      '/api/monitoring/health': { get: { summary: 'System Health Check' } },
      '/api/backup/jobs': { get: { summary: 'List Backup Snapshots' } },
      '/api/bi/copilot': { post: { summary: 'Natural Language AI Copilot Query' } },
    },
  });
});

