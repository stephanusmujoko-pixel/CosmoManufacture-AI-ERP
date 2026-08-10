import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  initialDemandForecasts,
  initialMpsList,
  initialMrpResults,
  initialCrpCapacities,
  initialProductionSchedules,
  initialMaterialLotReservations,
  initialPpicScenarios,
  DemandForecastItem,
  MpsItem,
  MrpResultItem,
  ProductionScheduleTask,
} from './ppicData.js';

export const ppicRouter = Router();

let demandForecasts = [...initialDemandForecasts];
let mpsList = [...initialMpsList];
let mrpResults = [...initialMrpResults];
let crpCapacities = [...initialCrpCapacities];
let productionSchedules = [...initialProductionSchedules];
let materialLotReservations = [...initialMaterialLotReservations];
let ppicScenarios = [...initialPpicScenarios];

// Initialize Gemini Client
const getAiClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

// ==========================================
// 1. DEMAND & FORECAST API
// ==========================================
ppicRouter.get('/ppic/demand-forecasts', (req: Request, res: Response) => {
  res.json({ success: true, data: demandForecasts });
});

ppicRouter.post('/ppic/demand-forecasts', (req: Request, res: Response) => {
  const { productCode, productName, category, salesOrderQty, forecastQty, period, safetyStockTarget } = req.body;

  if (!productName || !productCode) {
    return res.status(400).json({ error: 'Kode dan Nama Produk wajib diisi.' });
  }

  const so = Number(salesOrderQty || 0);
  const fc = Number(forecastQty || 0);
  const tot = so + fc;
  const safety = Number(safetyStockTarget || 3000);
  const curStock = 2000; // default initial stock
  const net = Math.max(0, tot + safety - curStock);

  const newItem: DemandForecastItem = {
    id: `FCT-${Date.now()}`,
    productCode,
    productName,
    category: category || 'General Skincare',
    salesOrderQty: so,
    forecastQty: fc,
    totalDemandQty: tot,
    uom: 'Pcs',
    safetyStockTarget: safety,
    currentStock: curStock,
    netDemandQty: net,
    period: period || 'Aug 2026',
    seasonalityFactor: 1.1,
    status: 'Approved',
  };

  demandForecasts.unshift(newItem);
  res.status(201).json({ success: true, message: 'Demand Forecast berhasil disimpan.', data: newItem });
});

// ==========================================
// 2. MASTER PRODUCTION SCHEDULE (MPS) API
// ==========================================
ppicRouter.get('/ppic/mps', (req: Request, res: Response) => {
  res.json({ success: true, data: mpsList });
});

ppicRouter.post('/ppic/mps', (req: Request, res: Response) => {
  const { productCode, productName, plannedQtyPcs, productionLine, assignedMachine, startDate, endDate, priority } = req.body;

  if (!productName || !plannedQtyPcs) {
    return res.status(400).json({ error: 'Nama Produk dan Jumlah Target Pcs wajib diisi.' });
  }

  const pcs = Number(plannedQtyPcs);
  const batchKg = Math.round(pcs * 0.03); // ~30ml average per unit = 0.03Kg

  const newMps: MpsItem = {
    id: `MPS-${Date.now()}`,
    mpsCode: `MPS-${productCode || 'COS'}-${Math.floor(Math.random() * 90 + 10)}`,
    productCode: productCode || 'FG-NEW',
    productName,
    formulaCode: `FORM-${productCode || 'SKIN'}-V1`,
    productionLine: productionLine || 'Line A (Serum & Liquid)',
    plannedQtyPcs: pcs,
    plannedBatchKg: batchKg,
    startDate: startDate || '2026-08-15',
    endDate: endDate || '2026-08-20',
    horizonPeriod: 'Weekly',
    freezeStatus: 'Open Horizon',
    approvalStatus: 'Approved',
    assignedMachine: assignedMachine || 'Vacuum Emulsifier Tank 1000L (Vessel-01)',
    priority: priority || 'Normal',
  };

  mpsList.unshift(newMps);
  res.status(201).json({ success: true, message: 'Master Production Schedule (MPS) baru berhasil ditambahkan.', data: newMps });
});

ppicRouter.put('/ppic/mps/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { freezeStatus, approvalStatus, priority } = req.body;

  const itemIndex = mpsList.findIndex((m) => m.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Data MPS tidak ditemukan.' });
  }

  if (freezeStatus) mpsList[itemIndex].freezeStatus = freezeStatus;
  if (approvalStatus) mpsList[itemIndex].approvalStatus = approvalStatus;
  if (priority) mpsList[itemIndex].priority = priority;

  res.json({ success: true, message: 'Status MPS berhasil diperbarui.', data: mpsList[itemIndex] });
});

// ==========================================
// 3. MRP EXPLOSION API
// ==========================================
ppicRouter.get('/ppic/mrp-results', (req: Request, res: Response) => {
  res.json({ success: true, data: mrpResults });
});

ppicRouter.post('/ppic/mrp-explosion', (req: Request, res: Response) => {
  // Simulate recursive BOM recalculation
  const updatedResults = mrpResults.map((m) => {
    if (m.netRequirementQty > 0 || m.status === 'Critical Shortage') {
      return {
        ...m,
        status: 'Critical Shortage' as const,
        recommendationType: 'Generate Purchase Requisition (PR)' as const,
      };
    }
    return m;
  });

  res.json({
    success: true,
    message: 'MRP Explosion Engine berhasil dieksekusi secara rekursif!',
    summary: {
      totalMpsProcessed: mpsList.length,
      criticalShortages: updatedResults.filter((r) => r.status === 'Critical Shortage').length,
      prGeneratedCount: updatedResults.filter((r) => r.recommendationType === 'Generate Purchase Requisition (PR)').length,
    },
    data: updatedResults,
  });
});

// ==========================================
// 4. CRP & PRODUCTION SCHEDULING API
// ==========================================
ppicRouter.get('/ppic/crp', (req: Request, res: Response) => {
  res.json({ success: true, data: crpCapacities });
});

ppicRouter.get('/ppic/schedules', (req: Request, res: Response) => {
  res.json({ success: true, data: productionSchedules });
});

ppicRouter.post('/ppic/schedules', (req: Request, res: Response) => {
  const { productName, batchQtyKg, targetPcs, machineVessel, scheduledStartTime, assignedOperator } = req.body;

  if (!productName || !machineVessel) {
    return res.status(400).json({ error: 'Nama Produk dan Mesin Vessel wajib diisi.' });
  }

  const newSchedule: ProductionScheduleTask = {
    id: `SCH-${Date.now()}`,
    moNumber: `MO-202608-${Math.floor(Math.random() * 900 + 100)}`,
    productName,
    batchQtyKg: Number(batchQtyKg || 500),
    targetPcs: Number(targetPcs || 15000),
    machineVessel,
    cleanroomGrade: 'Grade C (Compounding)',
    scheduledStartTime: scheduledStartTime || '2026-08-12 08:00',
    scheduledEndTime: '2026-08-13 17:00',
    assignedOperator: assignedOperator || 'Operator Tim Cleanroom A',
    status: 'Scheduled',
    fefoMaterialReady: true,
    qcApprovalStatus: 'Passed',
  };

  productionSchedules.unshift(newSchedule);
  res.status(201).json({ success: true, message: 'Jadwal Produksi Baru Berhasil Ditambahkan.', data: newSchedule });
});

// ==========================================
// 5. AI PPIC ASSISTANT CHAT API
// ==========================================
ppicRouter.post('/ppic/ai-chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt pertanyaan PPIC wajib diisi.' });
  }

  const ai = getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Anda adalah AI PPIC Expert & Production Optimizer untuk Pabrik Kosmetik & Skincare PT Paragonia Cosmetic Industri.
Analisis konteks PPIC:
- Active MPS Horizon: 3 Finished Goods (Serum 30k Pcs, Cream 25k Pcs, Sunscreen 16k Pcs)
- Machine Capacity: Vessel-01 Vacuum Emulsifier 1000L utilisasi 97.5% (Bottleneck)
- Critical Material Shortage: Niacinamide USP Grade (Shortage 22Kg, Lead time 14 hari)

Pertanyaan PPIC Planner: "${prompt}"

Berikan saran taktis, langkah optimasi MPS/MRP/CRP, serta rekomendasi mitigasi risiko stockout secara singkat, profesional, bertitik poin, dan kontekstual industri kosmetik CPKB BPOM.`,
              },
            ],
          },
        ],
      });

      const replyText = response.text || 'Rekomendasi AI PPIC Optimizer siap dieksekusi.';
      return res.json({ success: true, reply: replyText });
    } catch (err: any) {
      console.error('Gemini PPIC AI error:', err);
    }
  }

  // Fallback heuristic response if Gemini key is missing or errored
  const fallbackReply = `🤖 **PPIC AI Assistant Optimizer Output:**

Berdasarkan analisa otomatis data MPS & MRP Realtime:
1. **Peringatan Shortage Material:** Bahan Niacinamide USP Grade (RM-ACT-001) mengalami defisit 22.0 Kg untuk Batch Serum Agustus. Segera buat Purchase Requisition ke *PT Specialty Chemical Indonesia* (Lead time 14 Hari).
2. **Penyeimbangan Beban Mesin (Line Balancing):** Vessel-01 Emulsifier 1000L beroperasi pada **97.5% utilisasi**. Pindahkan batch Cream ke Vessel-02 untuk mengurangi downtime CIP sebesar 4.5 jam.
3. **FEFO Reservasi:** Stok Lot LOT-NIA-202506-01 (Exp Jun 2027) siap di-release oleh QC Lab untuk Work Order MO-20260810-001.`;

  res.json({ success: true, reply: fallbackReply });
});
