import { Router, Request, Response } from 'express';
import {
  initialBpomSubmissions,
  initialCpkbAuditItems,
  initialRegulatedIngredients,
  BpomSubmission,
  CpkbAuditItem,
} from './regulatoryData.js';

export const regulatoryRouter = Router();

let bpomStore = [...initialBpomSubmissions];
let cpkbStore = [...initialCpkbAuditItems];

// GET /api/regulatory/bpom
regulatoryRouter.get('/regulatory/bpom', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: bpomStore,
    totalCount: bpomStore.length,
  });
});

// POST /api/regulatory/bpom
regulatoryRouter.post('/regulatory/bpom', (req: Request, res: Response) => {
  const { productName, brandName, formulaCode, category, applicantCompany, registrationNumber } = req.body;
  
  if (!productName || !brandName) {
    return res.status(400).json({ success: false, error: 'Product Name and Brand Name are required.' });
  }

  const newSubmission: BpomSubmission = {
    id: `bpom-${Date.now().toString().slice(-4)}`,
    submissionCode: `SUB-BPOM-2026-${(bpomStore.length + 1).toString().padStart(3, '0')}`,
    productName,
    brandName,
    category: category || 'Skincare - Facial Serum',
    formulaCode: formulaCode || 'FORM-NEW-2026',
    naNumber: registrationNumber || `SUB-PENDING-${Date.now().toString().slice(-4)}`,
    expiryDateNa: 'Pending BPOM Review',
    status: 'Submitted to BPOM',
    dipPart1Complete: true,
    dipPart2Complete: true,
    dipPart3Complete: false,
    dipPart4Complete: false,
    halalStatus: 'In Process BPJPH',
    halalCertNo: `REG-BPJPH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  bpomStore.unshift(newSubmission);
  res.status(201).json({
    success: true,
    message: `Permohonan Notifikasi e-BPOM untuk ${productName} berhasil dibuat & diunggah ke e-BPOM.`,
    data: newSubmission,
  });
});

// GET /api/regulatory/cpkb
regulatoryRouter.get('/regulatory/cpkb', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: cpkbStore,
    totalCount: cpkbStore.length,
  });
});

// POST /api/regulatory/cpkb
regulatoryRouter.post('/regulatory/cpkb', (req: Request, res: Response) => {
  const { clause, title, category, status, evidence, correctiveAction, picName } = req.body;

  const newItem: CpkbAuditItem = {
    id: `cpkb-${Date.now().toString().slice(-4)}`,
    clause: clause || 'Klausal 4.0 CPKB',
    title: title || 'Temuan Audit CPKB Baru',
    category: category || 'Sanitasi & Higiene',
    status: status || 'Compliant',
    evidence: evidence || 'Bukti inspeksi visual terverifikasi oleh QA Officer.',
    correctiveAction: correctiveAction || 'Tindakan perbaikan dan pencegahan (CAPA) dijalankan.',
    targetDate: new Date(Date.now() + 86400000 * 14).toISOString().substring(0, 10),
    picName: picName || 'Rina Sulistyo (QA Lead)',
  };

  cpkbStore.unshift(newItem);
  res.status(201).json({
    success: true,
    message: 'Audit finding CPKB ISO 22716 berhasil dicatat.',
    data: newItem,
  });
});

// GET /api/regulatory/ingredients-check
regulatoryRouter.get('/regulatory/ingredients-check', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: initialRegulatedIngredients,
  });
});

// POST /api/regulatory/ai-verify
regulatoryRouter.post('/regulatory/ai-verify', (req: Request, res: Response) => {
  const { inciName, concentrationPct, productType } = req.body;

  let complianceStatus = 'Compliant (Sesuai PerBPOM No. 23/2019)';
  let warningMessage = 'Kadar aman digunakan untuk sediaan kosmetik.';

  if (inciName.toLowerCase().includes('hydroquinone')) {
    complianceStatus = 'REJECTED - DILARANG TOTAL';
    warningMessage = 'CRITICAL ERROR: Hydroquinone dilarang dalam kosmetik menurut PerBPOM No. 23/2019!';
  } else if (inciName.toLowerCase().includes('salicylic') && concentrationPct > 2.0 && productType === 'leave_on') {
    complianceStatus = 'NON-COMPLIANT (Melebihi Batas)';
    warningMessage = 'Salicylic Acid Leave-On maksimal 2.0%. Tambahkan peringatan anak <3 tahun!';
  } else if (inciName.toLowerCase().includes('niacinamide') && concentrationPct > 10.0) {
    complianceStatus = 'WARNING (Konsentrasi Tinggi)';
    warningMessage = 'Niacinamide > 10.0% dapat meningkatkan risiko eritema/iritasi lokal.';
  }

  res.json({
    success: true,
    analysis: {
      inciName,
      concentrationPct,
      productType,
      complianceStatus,
      warningMessage,
      bpomRef: 'PerBPOM No. 23 Tahun 2019 & ASEAN Cosmetic Directive (ACD)',
    },
  });
});
