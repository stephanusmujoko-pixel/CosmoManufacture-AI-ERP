import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/authRoutes.js';
import { saasRouter } from './server/saasRoutes.js';
import { masterRouter } from './server/masterRoutes.js';
import { crmRouter } from './server/crmRoutes.js';
import { procurementRouter } from './server/procurementRoutes.js';
import { rdPlmRouter } from './server/rdPlmRoutes.js';
import eamCmmsRouter from './server/eamCmmsRoutes.js';
import { financeRouter } from './server/financeRoutes.js';
import { hrisRouter } from './server/hrisRoutes.js';
import { biRouter } from './server/biRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Mount Prompt 4 Auth, Security, RBAC & Multi-Tenant Routes
app.use('/api', authRouter);
// Mount Prompt 5 Multi-Tenant SaaS, License, Subscription & Billing Routes
app.use('/api', saasRouter);
// Mount Prompt 6 Enterprise Master Data Routes (Products, Raw Materials, Suppliers, Machines, Warehouses, Document Numbering, Audit Trail)
app.use('/api', masterRouter);
// Mount Prompt 7 CRM & Sales Management Enterprise Routes
app.use('/api', crmRouter);
// Mount Prompt 8 Purchasing & Procurement Enterprise Routes
app.use('/api', procurementRouter);
// Mount Prompt 15 Research & Development (R&D) & PLM Enterprise Routes
app.use('/api', rdPlmRouter);
// Mount Prompt 16 Enterprise Asset Management (EAM) & CMMS Routes
app.use('/api', eamCmmsRouter);
// Mount Prompt 17 Finance, Cost Accounting & General Ledger Enterprise Routes
app.use('/api', financeRouter);
// Mount Prompt 18 Human Resource Information System (HRIS) & Payroll Routes
app.use('/api', hrisRouter);
// Mount Prompt 19 Business Intelligence (BI), AI Copilot & Executive Dashboard Routes
app.use('/api', biRouter);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CosmoManufacture AI ERP Server',
    timestamp: new Date().toISOString(),
    geminiKeyAvailable: Boolean(process.env.GEMINI_API_KEY),
  });
});

// License Validation API
app.post('/api/license/validate', (req, res) => {
  const { licenseKey, hardwareHash, domain } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ valid: false, message: 'License key is required.' });
  }

  const isEnterprise = licenseKey.includes('COSMO-ENT');
  const isStarter = licenseKey.includes('COSMO-STR');

  if (isEnterprise || isStarter) {
    return res.json({
      valid: true,
      licenseKey,
      companyName: 'PT Paragonia Cosmetic Industri',
      tier: isEnterprise ? 'enterprise' : 'starter',
      status: 'active',
      expiryDate: '2027-01-15',
      hardwareBound: hardwareHash ? true : false,
      domainBound: domain || 'paragonia.cosmomanufacture.ai',
      allowedModules: [
        'Master Data',
        'R&D Formula Lab',
        'Batch MES Production',
        'Quality Control Lab',
        'BPOM Regulatory & CPKB',
        'Raw Material & Warehouse',
        'AI Center (16 Agents)',
        'Finance & COGM',
      ],
      message: 'License key successfully validated.',
    });
  }

  return res.json({
    valid: false,
    message: 'Invalid license key format or key suspended.',
  });
});

// AI ERP Chat Endpoint using Gemini 3.6 Flash
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, agentRole, erpContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const systemInstruction = `
Anda adalah AI Specialist ERP untuk sistem "CosmoManufacture AI ERP" - Smart AI ERP for Cosmetic & Skincare Manufacturing.
Peran Anda saat ini: ${agentRole || 'CEO Executive Assistant'}.

Konteks Bisnis & Data ERP Terkini Pabrik:
- Perusahaan: PT Paragonia Cosmetic Industri (Maklon & OEM Kosmetik/Skincare)
- Status CPKB: Certified ISO 22716, Izin Industri BPOM Class A
- Produk Utama: Luminance Glow Serum (10% Niacinamide), Barrier Defense Cream, Sunscreen SPF50
- Batch Aktif MES: Batch B-2026-0801 (Selesai Yield 98.5%), Batch B-2026-0802 (Mixing 3,500 RPM, Temp 64.8°C), Batch B-2026-0803 (Weighing Cleanroom 2)
- QC Lab: Uji Organoleptik, Viskositas, pH, dan Angka Lempeng Total (ALT < 100 CFU/g)
- BPOM NA Active: NA18240199882 (Serum Glow)
- Tambahan Konteks Spesifik: ${JSON.stringify(erpContext || {})}

Aturan Jawaban:
1. Berikan jawaban yang sangat profesional, terstruktur, berbasis data riil manufaktur kosmetik Indonesia (e-BPOM, CPKB, Halal MUI, HPP/COGM, Yield MES).
2. Gunakan Bahasa Indonesia profesional industri kefarmasian/kosmetik.
3. Berikan rekomendasi konkret, actionable, dan kuantitatif jika memungkinkan.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Maaf, sistem AI tidak memberikan respon.';

    return res.json({
      reply: replyText,
      agentRole,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error calling Gemini API in /api/ai/chat:', error);
    return res.status(500).json({
      error: 'Gagal menghubungi Gemini AI Service.',
      details: error.message || String(error),
    });
  }
});

// AI Formula Analysis Endpoint
app.post('/api/ai/analyze-formula', async (req, res) => {
  try {
    const { formulaName, category, ingredients, targetPh } = req.body;

    const prompt = `
Analisis Formula Kosmetik berikut dari segi Regulasi BPOM, Keamanan Kulit, Efektivitas Emulsi, dan Estimasi Biaya:
- Nama Formula: ${formulaName}
- Kategori: ${category}
- Target pH: ${targetPh}
- Bahan INCI & Persentase: ${JSON.stringify(ingredients || [])}

Berikan analisis terstruktur mencakup:
1. Kesesuaian Regulasi BPOM (Apakah ada bahan melebihi batas amannya?)
2. Evaluasi Sinergi Bahan Aktif & Keamanan Kulit
3. Rekomendasi Urutan Pengolahan Fase A/B/C/D di Tanki Homogenizer
4. Saran Optimasi HPP (Biaya) tanpa Mengurangi Efektivitas
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Anda adalah Senior Cosmetic Chemist & Regulatory Expert BPOM Indonesia. Berikan evaluasi ilmiah dan teknis mendalam.',
        temperature: 0.6,
      },
    });

    return res.json({
      analysis: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error calling Gemini API in /api/ai/analyze-formula:', error);
    return res.status(500).json({
      error: 'Gagal melakukan analisis formula AI.',
      details: error.message || String(error),
    });
  }
});

// Serve frontend with Vite in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CosmoManufacture AI ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
