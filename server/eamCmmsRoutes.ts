import { Router, Request, Response } from 'express';
import {
  initialAssets,
  initialMachines,
  initialWorkOrders,
  initialCalibrations,
  initialSpareParts,
  initialUtilities,
  initialEnergyLogs,
  Asset,
  MachineRegister,
  MaintenanceWorkOrder,
  CalibrationRecord,
  SparePartMaster,
  UtilityAsset,
  EnergyLog,
} from './eamCmmsData';

const router = Router();

// In-memory state for runtime operations
let assetsStore: Asset[] = [...initialAssets];
let machinesStore: MachineRegister[] = [...initialMachines];
let workOrdersStore: MaintenanceWorkOrder[] = [...initialWorkOrders];
let calibrationsStore: CalibrationRecord[] = [...initialCalibrations];
let sparePartsStore: SparePartMaster[] = [...initialSpareParts];
let utilitiesStore: UtilityAsset[] = [...initialUtilities];
let energyLogsStore: EnergyLog[] = [...initialEnergyLogs];

// ----------------------------------------------------
// ASSETS API
// ----------------------------------------------------
router.get('/assets', (req: Request, res: Response) => {
  res.json({ success: true, count: assetsStore.length, data: assetsStore });
});

router.post('/assets', (req: Request, res: Response) => {
  const newAsset: Asset = {
    id: `asset-${Date.now()}`,
    assetCode: req.body.assetCode || `AST-${Date.now().toString().slice(-4)}`,
    assetName: req.body.assetName || 'New Machine/Equipment',
    category: req.body.category || 'Production Equipment',
    hierarchyLocation: req.body.hierarchyLocation || 'Factory 1 > Main Area',
    serialNumber: req.body.serialNumber || 'SN-UNKNOWN',
    manufacturer: req.body.manufacturer || 'Generic Tech',
    modelNumber: req.body.modelNumber || 'MOD-100',
    purchaseDate: req.body.purchaseDate || new Date().toISOString().split('T')[0],
    purchaseCostIdr: Number(req.body.purchaseCostIdr) || 100000000,
    warrantyExpiry: req.body.warrantyExpiry || '2028-01-01',
    lifecycleStage: req.body.lifecycleStage || 'Installation',
    status: req.body.status || 'In Service',
    assignedTechnician: req.body.assignedTechnician || 'Unassigned',
    criticality: req.body.criticality || 'Medium',
  };

  assetsStore.unshift(newAsset);
  res.status(201).json({ success: true, message: 'Asset created successfully', data: newAsset });
});

router.patch('/assets/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, lifecycleStage } = req.body;
  const asset = assetsStore.find((a) => a.id === id);

  if (!asset) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }

  if (status) asset.status = status;
  if (lifecycleStage) asset.lifecycleStage = lifecycleStage;

  res.json({ success: true, message: 'Asset status updated', data: asset });
});

// ----------------------------------------------------
// MACHINES REGISTER API
// ----------------------------------------------------
router.get('/machines', (req: Request, res: Response) => {
  res.json({ success: true, count: machinesStore.length, data: machinesStore });
});

router.post('/machines', (req: Request, res: Response) => {
  const newMachine: MachineRegister = {
    id: `mach-${Date.now()}`,
    machineCode: req.body.machineCode || `MCH-${Date.now().toString().slice(-4)}`,
    machineName: req.body.machineName || 'New Production Unit',
    lineLocation: req.body.lineLocation || 'Processing Line A',
    powerRatingKw: Number(req.body.powerRatingKw) || 22.0,
    runtimeHours: Number(req.body.runtimeHours) || 0,
    oeeAvailabilityPercent: 95.0,
    mtbfHours: 500,
    mttrHours: 2.0,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextPreventiveDate: req.body.nextPreventiveDate || '2026-09-01',
    calibrationRequired: Boolean(req.body.calibrationRequired),
    calibrationExpiryDate: req.body.calibrationExpiryDate || '2027-01-01',
    status: req.body.status || 'Running',
  };

  machinesStore.unshift(newMachine);
  res.status(201).json({ success: true, message: 'Machine registered successfully', data: newMachine });
});

// ----------------------------------------------------
// WORK ORDERS (CMMS) API
// ----------------------------------------------------
router.get('/work-orders', (req: Request, res: Response) => {
  res.json({ success: true, count: workOrdersStore.length, data: workOrdersStore });
});

router.post('/work-orders', (req: Request, res: Response) => {
  const {
    assetId,
    assetName,
    machineCode,
    location,
    category,
    priority,
    problemDescription,
    assignedTechnician,
    supervisor,
    estimatedHours,
  } = req.body;

  // Business Rule: Validate Machine / Asset Status
  const targetMachine = machinesStore.find((m) => m.machineCode === machineCode || m.id === assetId);
  if (targetMachine && targetMachine.status === 'Breakdown' && category === 'Preventive') {
    return res.status(400).json({
      success: false,
      message: 'Business Rule Violation: Cannot create Preventive WO on a machine currently in Breakdown status.',
    });
  }

  const newWO: MaintenanceWorkOrder = {
    id: `wo-${Date.now()}`,
    woNumber: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    requestNumber: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    assetId: assetId || 'asset-1',
    assetName: assetName || 'Cosmetic Equipment Unit',
    machineCode: machineCode || 'MCH-GENERIC',
    location: location || 'Cleanroom Processing Area',
    category: category || 'Corrective',
    priority: priority || 'High',
    problemDescription: problemDescription || 'Maintenance check required.',
    assignedTechnician: assignedTechnician || 'Hendra Setiawan',
    supervisor: supervisor || 'Bambang Suprianto (Maintenance Mgr)',
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: req.body.scheduledDate || new Date().toISOString().split('T')[0],
    estimatedHours: Number(estimatedHours) || 3.0,
    status: 'Pending Approval',
    totalCostIdr: 0,
  };

  workOrdersStore.unshift(newWO);
  res.status(201).json({ success: true, message: 'Work Order generated successfully', data: newWO });
});

router.patch('/work-orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, actualHours, rootCause, sparePartsUsed } = req.body;
  const wo = workOrdersStore.find((w) => w.id === id);

  if (!wo) {
    return res.status(404).json({ success: false, message: 'Work Order not found' });
  }

  if (status) wo.status = status;
  if (actualHours) wo.actualHours = Number(actualHours);
  if (rootCause) wo.rootCause = rootCause;

  if (sparePartsUsed && Array.isArray(sparePartsUsed)) {
    wo.sparePartsUsed = sparePartsUsed;
    let partsCost = 0;
    sparePartsUsed.forEach((p) => {
      partsCost += p.qtyUsed * p.costIdr;

      // Deduct stock in Spare Parts inventory
      const sp = sparePartsStore.find((item) => item.partCode === p.partCode);
      if (sp) {
        sp.stockQuantity = Math.max(0, sp.stockQuantity - p.qtyUsed);
      }
    });
    wo.totalCostIdr = partsCost;
  }

  // Update machine status if WO completed
  if (status === 'Verified & Closed' || status === 'Completed') {
    const mach = machinesStore.find((m) => m.machineCode === wo.machineCode);
    if (mach) {
      mach.status = 'Running';
      mach.lastMaintenanceDate = new Date().toISOString().split('T')[0];
    }
  }

  res.json({ success: true, message: 'Work order updated', data: wo });
});

// ----------------------------------------------------
// CALIBRATION MANAGEMENT API
// ----------------------------------------------------
router.get('/calibration', (req: Request, res: Response) => {
  res.json({ success: true, count: calibrationsStore.length, data: calibrationsStore });
});

router.post('/calibration', (req: Request, res: Response) => {
  const newCal: CalibrationRecord = {
    id: `cal-${Date.now()}`,
    calibrationCode: `CAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    assetId: req.body.assetId || 'asset-2',
    instrumentName: req.body.instrumentName || 'Analytical Instrument',
    serialNumber: req.body.serialNumber || 'SN-CAL-001',
    location: req.body.location || 'Quality Control Lab',
    calibrationType: req.body.calibrationType || 'External Accredited (KAN / ISO 17025)',
    serviceProvider: req.body.serviceProvider || 'PT Kalibrasi Presisi',
    lastCalibrationDate: req.body.lastCalibrationDate || new Date().toISOString().split('T')[0],
    nextDueDate: req.body.nextDueDate || '2027-08-01',
    certificateNumber: req.body.certificateNumber || `KAN-${Math.floor(10000 + Math.random() * 90000)}`,
    result: req.body.result || 'Passed (Qualified)',
    status: 'Valid',
    validatedByQc: true,
  };

  calibrationsStore.unshift(newCal);
  res.status(201).json({ success: true, message: 'Calibration certificate recorded', data: newCal });
});

// ----------------------------------------------------
// SPARE PARTS MANAGEMENT API
// ----------------------------------------------------
router.get('/spare-parts', (req: Request, res: Response) => {
  res.json({ success: true, count: sparePartsStore.length, data: sparePartsStore });
});

router.post('/spare-parts', (req: Request, res: Response) => {
  const newPart: SparePartMaster = {
    id: `sp-${Date.now()}`,
    partCode: req.body.partCode || `PRT-${Date.now().toString().slice(-4)}`,
    partName: req.body.partName || 'New Mechanical Spare Part',
    category: req.body.category || 'Mechanical Seal',
    compatibleMachines: req.body.compatibleMachines || ['MCH-MIX-01'],
    stockQuantity: Number(req.body.stockQuantity) || 10,
    minReorderPoint: Number(req.body.minReorderPoint) || 3,
    unitCostIdr: Number(req.body.unitCostIdr) || 250000,
    supplierName: req.body.supplierName || 'PT Spareparts Utama',
    storageBinLocation: req.body.storageBinLocation || 'Rack A-01',
    isCritical: Boolean(req.body.isCritical),
  };

  sparePartsStore.unshift(newPart);
  res.status(201).json({ success: true, message: 'Spare part registered', data: newPart });
});

// ----------------------------------------------------
// UTILITIES & ENERGY API
// ----------------------------------------------------
router.get('/utilities', (req: Request, res: Response) => {
  res.json({ success: true, count: utilitiesStore.length, data: utilitiesStore });
});

router.get('/energy', (req: Request, res: Response) => {
  res.json({ success: true, count: energyLogsStore.length, data: energyLogsStore });
});

// ----------------------------------------------------
// AI MAINTENANCE ASSISTANT ENDPOINT
// ----------------------------------------------------
router.post('/ai-maintenance/predict', (req: Request, res: Response) => {
  const { machineCode } = req.body;
  const machine = machinesStore.find((m) => m.machineCode === machineCode) || machinesStore[0];

  const estimatedRulDays = Math.floor(15 + Math.random() * 45);
  const failureProbabilityPercent = Math.floor(12 + Math.random() * 30);
  const predictedFailureComponent = 'Homogenizer High-Pressure Shaft Seal & Rotor Bearing';
  const recommendedAction = 'Schedule preventive seal replacement and vibration calibration during the upcoming scheduled downtime.';

  res.json({
    success: true,
    machineCode: machine.machineCode,
    machineName: machine.machineName,
    aiAnalysis: {
      healthScore: 100 - failureProbabilityPercent,
      estimatedRemainingUsefulLifeDays: estimatedRulDays,
      failureProbability30DaysPercent: failureProbabilityPercent,
      vibrationAnomalyScore: '0.042 mm/s (Normal Range)',
      temperatureTrend: '48.5 °C (Stable)',
      suspectedVulnerableComponent: predictedFailureComponent,
      aiRecommendation: recommendedAction,
      mtbfHours: machine.mtbfHours,
      mttrHours: machine.mttrHours,
    },
  });
});

export default router;
