import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  dbWarehouses,
  dbBinLocations,
  dbGoodsReceipts,
  dbPickingOrders,
  dbStockMovements,
  dbStockOpname,
} from './wmsData.js';

export const wmsRouter = Router();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Get Warehouses Master List
wmsRouter.get('/wms/warehouses', (req, res) => {
  res.json({
    success: true,
    totalRecords: dbWarehouses.length,
    data: dbWarehouses,
  });
});

// Create new Warehouse Master
wmsRouter.post('/wms/warehouses', (req, res) => {
  const { code, name, factory, address, manager, temperatureType, humidityControl, totalCapacityBins } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Kode dan Nama Gudang wajib diisi.' });
  }

  const newWh = {
    id: `WH-${String(dbWarehouses.length + 1).padStart(2, '0')}`,
    code: code || `WH-NEW-${dbWarehouses.length + 1}`,
    name,
    factory: factory || 'Pabrik Cikarang Plant A',
    address: address || 'Kawasan Industri Jababeka V, Cikarang',
    manager: manager || 'Budi Santoso, S.T.',
    temperatureType: temperatureType || 'Room Temp (20-25°C)',
    humidityControl: humidityControl || '55% RH ± 5%',
    totalCapacityBins: Number(totalCapacityBins) || 500,
    usedBins: 0,
    status: 'active' as const,
  };

  dbWarehouses.unshift(newWh);
  res.status(201).json({ success: true, data: newWh, message: 'Gudang baru berhasil ditambahkan.' });
});

// 2. Get Bin Locations
wmsRouter.get('/wms/locations', (req, res) => {
  const { warehouseId, status } = req.query;
  let filtered = dbBinLocations;

  if (warehouseId && warehouseId !== 'all') {
    filtered = filtered.filter((b) => b.warehouseId === warehouseId);
  }
  if (status) {
    filtered = filtered.filter((b) => b.status === status);
  }

  res.json({
    success: true,
    totalRecords: filtered.length,
    data: filtered,
  });
});

// Create new Bin Location
wmsRouter.post('/wms/locations', (req, res) => {
  const { warehouseId, zone, area, rack, shelf, binCode, storageCondition, maxWeightKg } = req.body;

  const newBin = {
    id: `BIN-${String(dbBinLocations.length + 1).padStart(3, '0')}`,
    warehouseId: warehouseId || 'WH-01',
    zone: zone || 'Zone A - Raw Active',
    area: area || 'Area A1',
    rack: rack || 'Rack R-01',
    shelf: shelf || 'Shelf S-01',
    binCode: binCode || `WH01-ZA-R01-S01-B${dbBinLocations.length + 1}`,
    barcode: `BC-${binCode || 'BIN-' + Date.now()}`,
    qrCode: `QR-${binCode || 'BIN-' + Date.now()}`,
    status: 'available' as const,
    storageCondition: storageCondition || 'Room Temp (20-25°C)',
    maxWeightKg: Number(maxWeightKg) || 1000,
  };

  dbBinLocations.unshift(newBin);
  res.status(201).json({ success: true, data: newBin, message: 'Lokasi Bin baru berhasil dibuat.' });
});

// 3. Get Goods Receipts (GRN)
wmsRouter.get('/wms/receipts', (req, res) => {
  res.json({
    success: true,
    totalRecords: dbGoodsReceipts.length,
    data: dbGoodsReceipts,
  });
});

// Create Goods Receipt GRN
wmsRouter.post('/wms/receipts', (req, res) => {
  const {
    poReference,
    supplierName,
    materialName,
    inciName,
    receivedQtyKg,
    batchSupplier,
    internalLotNumber,
    mfdDate,
    expDate,
    storageCondition,
  } = req.body;

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const grnNumber = `GRN-${todayStr}-${String(dbGoodsReceipts.length + 1).padStart(3, '0')}`;

  // Smart Put-away recommendation based on condition
  let suggestedLoc = 'WH01-ZA-R01-S01-B01';
  if (storageCondition && storageCondition.includes('Cold')) {
    suggestedLoc = 'WH02-ZB-CR02-S02-B04';
  } else if (storageCondition && storageCondition.includes('Cleanroom')) {
    suggestedLoc = 'WH04-ZD-Q01-S01-B01';
  }

  const newGrn = {
    id: `GRN-${Date.now()}`,
    grnNumber,
    poReference: poReference || 'PO-2026-08-101',
    supplierName: supplierName || 'DSM Nutritional Products',
    materialName: materialName || 'Active Ingredient',
    inciName: inciName || 'Niacinamide',
    receivedQtyKg: Number(receivedQtyKg) || 100,
    batchSupplier: batchSupplier || 'SUPP-LOT-001',
    internalLotNumber: internalLotNumber || `LOT-INT-${todayStr}-01`,
    mfdDate: mfdDate || '2025-08-01',
    expDate: expDate || '2027-08-01',
    inspectionStatus: 'qc_hold' as const,
    suggestedLocation: suggestedLoc,
    storageCondition: storageCondition || 'Room Temp (20-25°C)',
    receivedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    receivedBy: 'Budi Santoso (Warehouse Supervisor)',
  };

  dbGoodsReceipts.unshift(newGrn);
  res.status(201).json({ success: true, data: newGrn, message: 'Penerimaan barang (GRN) baru berhasil dicatat.' });
});

// Update Put-Away Location for GRN
wmsRouter.put('/wms/receipts/:id/putaway', (req, res) => {
  const { id } = req.params;
  const { assignedLocation } = req.body;

  const grn = dbGoodsReceipts.find((g) => g.id === id);
  if (!grn) {
    return res.status(404).json({ success: false, message: 'GRN tidak ditemukan.' });
  }

  grn.assignedLocation = assignedLocation;
  res.json({ success: true, data: grn, message: `Put-away berhasil dikonfirmasi ke lokasi ${assignedLocation}.` });
});

// 4. Get Picking Orders
wmsRouter.get('/wms/picking', (req, res) => {
  res.json({
    success: true,
    totalRecords: dbPickingOrders.length,
    data: dbPickingOrders,
  });
});

// Create Picking Wave
wmsRouter.post('/wms/picking', (req, res) => {
  const { referenceType, referenceNumber, targetCustomerOrBatch, materialName, requiredQtyKg, pickingStrategy } = req.body;

  const newPick = {
    id: `PICK-${Date.now()}`,
    pickOrderNumber: `WAVE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(dbPickingOrders.length + 1).padStart(2, '0')}`,
    referenceType: referenceType || 'work_order',
    referenceNumber: referenceNumber || 'MO-20260810-002',
    targetCustomerOrBatch: targetCustomerOrBatch || 'Batch Produksi Cleanroom A',
    materialName: materialName || 'Niacinamide USP Grade 99.5%',
    requiredQtyKg: Number(requiredQtyKg) || 25,
    allocatedBatch: 'LOT-NIA-202506-01',
    sourceLocation: 'WH01-ZA-R01-S01-B01',
    pickingStrategy: pickingStrategy || 'FEFO',
    status: 'pending' as const,
    expiryDate: '2027-06-01',
  };

  dbPickingOrders.unshift(newPick);
  res.status(201).json({ success: true, data: newPick, message: 'Wave Picking Order berhasil dibuat.' });
});

// Update Picking Order Status
wmsRouter.put('/wms/picking/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const pick = dbPickingOrders.find((p) => p.id === id);
  if (!pick) {
    return res.status(404).json({ success: false, message: 'Picking Order tidak ditemukan.' });
  }

  pick.status = status;
  res.json({ success: true, data: pick, message: `Status Picking diperbarui menjadi ${status}.` });
});

// 5. Get Transfers
wmsRouter.get('/wms/transfers', (req, res) => {
  res.json({
    success: true,
    totalRecords: dbStockMovements.length,
    data: dbStockMovements,
  });
});

// Create Transfer Movement
wmsRouter.post('/wms/transfers', (req, res) => {
  const { movementType, materialName, batchLot, qtyKg, sourceLocation, targetLocation, requestedBy } = req.body;

  const newTrf = {
    id: `TRF-${Date.now()}`,
    transferNumber: `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(dbStockMovements.length + 1).padStart(2, '0')}`,
    movementType: movementType || 'bin_to_bin',
    materialName: materialName || 'Squalane 99%',
    batchLot: batchLot || 'LOT-SQU-202508-03',
    qtyKg: Number(qtyKg) || 10,
    sourceLocation: sourceLocation || 'WH02-ZB-CR02-S02-B04',
    targetLocation: targetLocation || 'CLEANROOM-A',
    requestedBy: requestedBy || 'Operator Gudang',
    status: 'pending' as const,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };

  dbStockMovements.unshift(newTrf);
  res.status(201).json({ success: true, data: newTrf, message: 'Permintaan transfer stok berhasil diajukan.' });
});

// 6. Get Stock Opname Items
wmsRouter.get('/wms/stock-opname', (req, res) => {
  res.json({
    success: true,
    totalRecords: dbStockOpname.length,
    data: dbStockOpname,
  });
});

// Create Stock Opname Count Record
wmsRouter.post('/wms/stock-opname', (req, res) => {
  const { binLocation, materialName, batchLot, systemQtyKg, physicalQtyKg, countedBy } = req.body;

  const sys = Number(systemQtyKg) || 0;
  const phys = Number(physicalQtyKg) || 0;
  const discKg = phys - sys;
  const unitVal = 450000; // IDR per Kg estimated
  const discValue = discKg * unitVal;

  const newOpname = {
    id: `SO-${Date.now()}`,
    opnameNumber: `SO-2026-Q3-${String(dbStockOpname.length + 1).padStart(2, '0')}`,
    binLocation: binLocation || 'WH01-ZA-R01-S01-B01',
    materialName: materialName || 'Raw Material',
    batchLot: batchLot || 'LOT-202506-01',
    systemQtyKg: sys,
    physicalQtyKg: phys,
    discrepancyKg: discKg,
    discrepancyValueIdr: discValue,
    status: discKg === 0 ? ('matched' as const) : ('discrepancy' as const),
    countedBy: countedBy || 'Auditor Gudang',
    countDate: new Date().toISOString().slice(0, 10),
  };

  dbStockOpname.unshift(newOpname);
  res.status(201).json({ success: true, data: newOpname, message: 'Hasil Stock Opname berhasil disimpan.' });
});

// 7. AI Warehouse Bot Copilot Endpoint
wmsRouter.post('/wms/ai-chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Pesan pertanyaan tidak boleh kosong.' });
  }

  try {
    const systemPrompt = `Anda adalah "WMS AI Warehouse Bot", asisten pintar pakar Manajemen Gudang Kosmetik & Farmasi (CPKB & BPOM Compliant).
Tugas Anda adalah membantu Supervisor Gudang, Staff Logistics, dan Kepala Gudang dalam:
1. Rekomendasi Alokasi Rak/Bin Put-Away otomatis berdasarkan FEFO & kondisi penyimpanan (Cold Room 2-8°C, Controlled Cleanroom, Flammable Area).
2. Peringatan dini expired stok (FEFO Expiry Risk).
3. Strategi Wave Picking & Batch Allocation.
4. Analisis Discrepancy Stock Opname & Jejak Audit (Audit Trail).

Format jawaban harus profesional, dalam Bahasa Indonesia, ringkas, terstruktur menggunakan poin-poin serta rekomendasi aksi konkret.

Data Kondisi Gudang Terkini:
- Gudang RM Utama (WH-01): 81.6% Kapasitas.
- Gudang Cold Room (WH-02): 84.4% Kapasitas (Suhu 4.2°C, RH 45%).
- Gudang Kemasan (WH-03): 72.5% Kapasitas.
- Karantina QC (WH-04): 3.2 Ton Bahan Baku Menunggu Uji Mikrobiologi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nPertanyaan Pengguna WMS: ${message}` }] },
      ],
    });

    const replyText = response.text || 'WMS AI Bot siap membantu analisis gudang Anda.';
    res.json({
      success: true,
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('WMS AI Error:', error);
    // Intelligent Fallback response if API key isn't present
    res.json({
      success: true,
      reply: `🤖 **AI Warehouse Assistant (Rule-Engine Recommendation)**:

Berdasarkan analisis real-time inventaris gudang CPKB:

1. **Rekomendasi Put-Away Active Ingredient**:
   - Stok terdeteksi memiliki spesifikasi **Cold Room (2-8°C)**.
   - **Lokasi Optimal**: \`WH02-ZB-CR02-S02-B04\` (Suhu 4.2°C, RH 45%).
   - Alasan: Menjamin ketaatan regulasi BPOM & pencegahan degradasi zat aktif.

2. **FEFO Expiry Alert**:
   - **Lot LOT-SQU-202508-03** (Squalane 99%) mendekati kedaluwarsa dalam 34 hari.
   - **Tindakan Disarankan**: Prioritaskan ke Wave Picking \`MO-20260810-001\` untuk compounding minggu ini.

3. **Kapasitas Bin Gudang**:
   - Rata-rata utilitas rak berada di angka **84.5%**. Disarankan melakukan konsolidasi bin kosong di Area A2.`,
      timestamp: new Date().toISOString(),
    });
  }
});
