import { Router, Request, Response } from 'express';
import {
  initialAssets,
  initialMachines,
  initialWorkOrders,
  initialCalibrations,
  initialSpareParts,
  initialUtilities,
  initialEnergyLogs,
  initialOeeRecords,
  initialDowntimeLogs,
  initialAutonomousChecklists,
  initialPmSchedules,
  Asset,
  MachineRegister,
  MaintenanceWorkOrder,
  CalibrationRecord,
  SparePartMaster,
  UtilityAsset,
  EnergyLog,
  OeeRecord,
  DowntimeLog,
  AutonomousChecklist,
  PreventiveSchedule,
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
let oeeStore: OeeRecord[] = [...initialOeeRecords];
let downtimeStore: DowntimeLog[] = [...initialDowntimeLogs];
let autonomousStore: AutonomousChecklist[] = [...initialAutonomousChecklists];
let pmScheduleStore: PreventiveSchedule[] = [...initialPmSchedules];

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

// ----------------------------------------------------
// OEE & DOWNTIME LOGS API
// ----------------------------------------------------
router.get('/oee/analytics', (req: Request, res: Response) => {
  // Overall plant average calculation
  const totalOee = oeeStore.reduce((acc, curr) => acc + curr.oeePercent, 0);
  const avgOee = oeeStore.length > 0 ? (totalOee / oeeStore.length).toFixed(1) : '0';

  const totalAvailability = oeeStore.reduce((acc, curr) => acc + curr.availabilityPercent, 0);
  const avgAvailability = oeeStore.length > 0 ? (totalAvailability / oeeStore.length).toFixed(1) : '0';

  const totalPerformance = oeeStore.reduce((acc, curr) => acc + curr.performancePercent, 0);
  const avgPerformance = oeeStore.length > 0 ? (totalPerformance / oeeStore.length).toFixed(1) : '0';

  const totalQuality = oeeStore.reduce((acc, curr) => acc + curr.qualityPercent, 0);
  const avgQuality = oeeStore.length > 0 ? (totalQuality / oeeStore.length).toFixed(1) : '0';

  res.json({
    success: true,
    summary: {
      overallOeePercent: Number(avgOee),
      availabilityPercent: Number(avgAvailability),
      performancePercent: Number(avgPerformance),
      qualityPercent: Number(avgQuality),
    },
    oeeRecords: oeeStore,
    downtimeLogs: downtimeStore,
  });
});

router.post('/oee/downtime-log', (req: Request, res: Response) => {
  const { machineCode, durationMinutes, category, rootCause, operatorName } = req.body;
  const targetMachine = machinesStore.find((m) => m.machineCode === machineCode) || machinesStore[0];

  const newLog: DowntimeLog = {
    id: `dt-${Date.now()}`,
    downtimeCode: `DT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    machineCode: targetMachine.machineCode,
    machineName: targetMachine.machineName,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    durationMinutes: Number(durationMinutes) || 15,
    category: category || 'Minor Stop / Jamming',
    rootCause: rootCause || 'Downtime logged by operator',
    operatorName: operatorName || 'Operator On Duty',
    status: 'Resolved',
  };

  downtimeStore.unshift(newLog);

  // Recalculate OEE availability for this machine
  const oeeRec = oeeStore.find((o) => o.machineCode === targetMachine.machineCode);
  if (oeeRec) {
    oeeRec.downtimeMinutes += Number(durationMinutes) || 15;
    oeeRec.actualOperatingMinutes = Math.max(0, oeeRec.plannedOperatingMinutes - oeeRec.downtimeMinutes);
    oeeRec.availabilityPercent = Number(((oeeRec.actualOperatingMinutes / oeeRec.plannedOperatingMinutes) * 100).toFixed(2));
    oeeRec.oeePercent = Number(((oeeRec.availabilityPercent * oeeRec.performancePercent * oeeRec.qualityPercent) / 10000).toFixed(2));

    if (category === 'Breakdown') oeeRec.sixBigLosses.breakdownMinutes += Number(durationMinutes);
    else if (category === 'Changeover & Setup') oeeRec.sixBigLosses.changeoverMinutes += Number(durationMinutes);
    else oeeRec.sixBigLosses.minorStopsMinutes += Number(durationMinutes);
  }

  res.status(201).json({
    success: true,
    message: 'Downtime event recorded and OEE metrics recalculated',
    data: newLog,
    updatedOee: oeeRec,
  });
});

// ----------------------------------------------------
// AUTONOMOUS MAINTENANCE (TPM 5S / CIL) API
// ----------------------------------------------------
router.get('/maintenance/autonomous-checklists', (req: Request, res: Response) => {
  res.json({ success: true, count: autonomousStore.length, data: autonomousStore });
});

router.post('/maintenance/autonomous-checklists', (req: Request, res: Response) => {
  const { machineCode, shift, operatorName, items } = req.body;
  const machine = machinesStore.find((m) => m.machineCode === machineCode) || machinesStore[0];

  const newChecklist: AutonomousChecklist = {
    id: `am-${Date.now()}`,
    checklistCode: `AM-${machine.machineCode.replace('MCH-', '')}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    machineCode: machine.machineCode,
    machineName: machine.machineName,
    shift: shift || 'Shift 1',
    operatorName: operatorName || 'Operator On Duty',
    supervisorName: 'Bambang Suprianto (Maint Leader)',
    date: new Date().toISOString().slice(0, 10),
    items: items || [],
    status: 'Completed',
  };

  autonomousStore.unshift(newChecklist);
  res.status(201).json({ success: true, message: 'Autonomous Maintenance Checklist Submitted', data: newChecklist });
});

// ----------------------------------------------------
// PREVENTIVE MAINTENANCE SCHEDULE API
// ----------------------------------------------------
router.get('/maintenance/pm-schedule', (req: Request, res: Response) => {
  res.json({ success: true, count: pmScheduleStore.length, data: pmScheduleStore });
});

router.post('/maintenance/pm-schedule', (req: Request, res: Response) => {
  const { machineCode, taskTitle, frequency, estimatedHours, assignedTechnician, criticality, nextDueDate } = req.body;
  const targetMach = machinesStore.find((m) => m.machineCode === machineCode) || machinesStore[0];

  const newPm: PreventiveSchedule = {
    id: `pm-${Date.now()}`,
    scheduleCode: `PMS-${targetMach.machineCode.replace('MCH-', '')}-${frequency.slice(0, 1).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`,
    machineCode: targetMach.machineCode,
    machineName: targetMach.machineName,
    taskTitle: taskTitle || 'Routine Preventive Maintenance Task',
    frequency: frequency || 'Monthly',
    nextDueDate: nextDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    estimatedHours: Number(estimatedHours) || 3.0,
    assignedTechnician: assignedTechnician || 'Hendra Setiawan',
    criticality: criticality || 'Medium',
    lastDoneDate: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
  };

  pmScheduleStore.unshift(newPm);
  res.status(201).json({ success: true, message: 'PM Schedule added successfully', data: newPm });
});

router.post('/maintenance/pm-schedule/:id/generate-wo', (req: Request, res: Response) => {
  const { id } = req.params;
  const pmItem = pmScheduleStore.find((p) => p.id === id);

  if (!pmItem) {
    return res.status(404).json({ success: false, message: 'PM Schedule not found' });
  }

  const targetMach = machinesStore.find((m) => m.machineCode === pmItem.machineCode);

  const newWO: MaintenanceWorkOrder = {
    id: `wo-${Date.now()}`,
    woNumber: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    requestNumber: `REQ-PM-${pmItem.scheduleCode}`,
    assetId: 'asset-1',
    assetName: pmItem.machineName,
    machineCode: pmItem.machineCode,
    location: targetMach ? targetMach.lineLocation : 'Processing Line',
    category: 'Preventive',
    priority: pmItem.criticality === 'High' ? 'High' : 'Medium',
    problemDescription: pmItem.taskTitle,
    assignedTechnician: pmItem.assignedTechnician,
    supervisor: 'Bambang Suprianto (Maintenance Mgr)',
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: pmItem.nextDueDate,
    estimatedHours: pmItem.estimatedHours,
    status: 'Pending Approval',
    totalCostIdr: 0,
  };

  workOrdersStore.unshift(newWO);
  pmItem.status = 'WO Created';

  res.status(201).json({
    success: true,
    message: `Work Order ${newWO.woNumber} generated from PM Schedule`,
    wo: newWO,
    pmSchedule: pmItem,
  });
});

// ----------------------------------------------------
// SPARE PART REORDER API
// ----------------------------------------------------
router.post('/spare-parts/:id/reorder', (req: Request, res: Response) => {
  const { id } = req.params;
  const part = sparePartsStore.find((sp) => sp.id === id);

  if (!part) {
    return res.status(404).json({ success: false, message: 'Spare Part not found' });
  }

  const reorderQty = Math.max(10, part.minReorderPoint * 3);
  const totalCostEstimate = reorderQty * part.unitCostIdr;

  res.json({
    success: true,
    message: `Purchase Requisition (PR) created for ${part.partName}`,
    prNumber: `PR-SP-${Math.floor(1000 + Math.random() * 9000)}`,
    partCode: part.partCode,
    reorderQty,
    supplierName: part.supplierName,
    totalCostEstimateIdr: totalCostEstimate,
  });
});

// ----------------------------------------------------
// MAINTENANCE AUDIT REPORT (CPKB & ISO 22716) API
// ----------------------------------------------------
router.get('/maintenance/audit-report', (req: Request, res: Response) => {
  const activeAssets = assetsStore.filter((a) => a.status === 'In Service').length;
  const pmCompletedCount = workOrdersStore.filter((w) => w.category === 'Preventive' && w.status === 'Verified & Closed').length;
  const pmTotalCount = workOrdersStore.filter((w) => w.category === 'Preventive').length;
  const pmComplianceRate = pmTotalCount > 0 ? Number(((pmCompletedCount / pmTotalCount) * 100).toFixed(1)) : 100;

  const validCalibrations = calibrationsStore.filter((c) => c.status === 'Valid').length;
  const calibrationComplianceRate = calibrationsStore.length > 0 ? Number(((validCalibrations / calibrationsStore.length) * 100).toFixed(1)) : 100;

  res.json({
    success: true,
    reportDate: new Date().toISOString().split('T')[0],
    standards: 'CPKB (Cara Pembuatan Kosmetika yang Baik) & ISO 22716 / ISO 17025',
    metrics: {
      totalRegisteredAssets: assetsStore.length,
      activeAssets,
      pmComplianceRatePercent: pmComplianceRate,
      calibrationCompliancePercent: calibrationComplianceRate,
      avgOeePercent: 94.8,
      mtbfHoursAvg: 520,
      mttrHoursAvg: 2.1,
    },
    verificationSignatures: {
      maintenanceManager: 'Bambang Suprianto, ST',
      qaManager: 'Dr. Indah Permata, M.Si (QA Manager)',
      plantHead: 'Ir. Hendra Wijaya (Plant Manager)',
    },
  });
});

// ----------------------------------------------------
// IOT TELEMETRY & SENSOR MONITORING API
// ----------------------------------------------------
router.get('/iot/telemetry', (req: Request, res: Response) => {
  const telemetryData = machinesStore.map((m) => {
    const baseVibration = 0.02 + Math.random() * 0.03;
    const baseTemp = 42 + Math.random() * 8;
    const basePressure = 0.85 + Math.random() * 0.1;
    return {
      machineCode: m.machineCode,
      machineName: m.machineName,
      status: m.status,
      sensors: {
        vibrationMmS: Number(baseVibration.toFixed(3)),
        vibrationStatus: baseVibration > 0.045 ? 'Warning' : 'Normal',
        temperatureCelsius: Number(baseTemp.toFixed(1)),
        temperatureStatus: baseTemp > 48.0 ? 'Warning' : 'Normal',
        vacuumPressureMpa: Number(basePressure.toFixed(2)),
        energyDrawKw: Number((m.powerRatingKw * (0.8 + Math.random() * 0.2)).toFixed(1)),
      },
      lastUpdated: new Date().toISOString(),
    };
  });

  res.json({ success: true, count: telemetryData.length, data: telemetryData });
});

// ----------------------------------------------------
// ASSET DEPRECIATION & LIFECYCLE COSTING API
// ----------------------------------------------------
router.get('/assets/depreciation-analysis', (req: Request, res: Response) => {
  const currentYear = new Date().getFullYear();

  const lifecycleReport = assetsStore.map((ast) => {
    const purchaseYr = new Date(ast.purchaseDate).getFullYear();
    const yearsInService = Math.max(1, currentYear - purchaseYr);
    const usefulLifeYears = 10; // Standard 10-year manufacturing asset life
    const annualDepreciationIdr = ast.purchaseCostIdr / usefulLifeYears;
    const accumulatedDepreciationIdr = Math.min(ast.purchaseCostIdr, annualDepreciationIdr * yearsInService);
    const currentBookValueIdr = Math.max(0, ast.purchaseCostIdr - accumulatedDepreciationIdr);

    // Calculate total maintenance cost from WOs for this asset
    const totalMaintCost = workOrdersStore
      .filter((w) => w.assetId === ast.id || w.machineCode.includes(ast.assetCode.split('-')[1] || ''))
      .reduce((sum, w) => sum + (w.totalCostIdr || 0), 0);

    const maintToCostRatioPercent = ast.purchaseCostIdr > 0 ? Number(((totalMaintCost / ast.purchaseCostIdr) * 100).toFixed(2)) : 0;

    return {
      assetId: ast.id,
      assetCode: ast.assetCode,
      assetName: ast.assetName,
      purchaseCostIdr: ast.purchaseCostIdr,
      purchaseDate: ast.purchaseDate,
      yearsInService,
      accumulatedDepreciationIdr,
      currentBookValueIdr,
      totalMaintenanceCostIdr: totalMaintCost,
      maintToCostRatioPercent,
      replacementRecommendation: maintToCostRatioPercent > 35 || yearsInService >= usefulLifeYears ? 'Consider Replacement / Overhaul' : 'Maintain Active Service',
    };
  });

  res.json({ success: true, count: lifecycleReport.length, data: lifecycleReport });
});

export default router;
