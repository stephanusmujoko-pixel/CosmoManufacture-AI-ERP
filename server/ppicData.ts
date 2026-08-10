export interface DemandForecastItem {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  salesOrderQty: number;
  forecastQty: number;
  totalDemandQty: number;
  uom: string;
  safetyStockTarget: number;
  currentStock: number;
  netDemandQty: number;
  period: string;
  seasonalityFactor: number;
  status: 'Draft' | 'Approved' | 'In Production';
}

export interface MpsItem {
  id: string;
  mpsCode: string;
  productCode: string;
  productName: string;
  formulaCode: string;
  productionLine: 'Line A (Serum & Liquid)' | 'Line B (Cream & Emulsion)' | 'Line C (Tube Packaging)';
  plannedQtyPcs: number;
  plannedBatchKg: number;
  startDate: string;
  endDate: string;
  horizonPeriod: 'Daily' | 'Weekly' | 'Monthly';
  freezeStatus: 'Frozen' | 'Slotted' | 'Open Horizon';
  approvalStatus: 'Approved' | 'Pending Approval' | 'Draft';
  assignedMachine: string;
  priority: 'High (Rush Order)' | 'Normal' | 'Low';
}

export interface MrpResultItem {
  id: string;
  materialCode: string;
  materialName: string;
  materialType: 'Active Ingredient' | 'Emulsifier/Base' | 'Preservative' | 'Primary Packaging' | 'Secondary Packaging';
  grossRequirementKgOrPcs: number;
  availableStock: number;
  reservedStock: number;
  onOrderQty: number;
  netRequirementQty: number;
  uom: 'Kg' | 'Pcs' | 'Liters';
  leadTimeDays: number;
  supplierName: string;
  moqQty: number;
  recommendationType: 'Generate Purchase Requisition (PR)' | 'Generate Manufacturing Order (MO)' | 'Stock Sufficient' | 'Alternative Material Substitution';
  actionDueDate: string;
  estimatedCostIDR: number;
  status: 'Critical Shortage' | 'Order Needed' | 'Sufficient';
}

export interface CrpCapacityItem {
  id: string;
  machineCode: string;
  machineName: string;
  department: string;
  maxCapacityHoursPerWeek: number;
  allocatedHours: number;
  utilizationPercentage: number;
  laborRequiredOperators: number;
  laborAvailableOperators: number;
  shiftMode: 'Shift 1 (8h)' | 'Shift 1 & 2 (16h)' | '24h Full Shift (3 Shifts)';
  bottleneckStatus: 'Optimal' | 'Near Capacity' | 'Critical Bottleneck';
}

export interface ProductionScheduleTask {
  id: string;
  moNumber: string;
  productName: string;
  batchQtyKg: number;
  targetPcs: number;
  machineVessel: string;
  cleanroomGrade: 'Grade C (Compounding)' | 'Grade D (Filling & Secondary)';
  scheduledStartTime: string;
  scheduledEndTime: string;
  assignedOperator: string;
  status: 'Scheduled' | 'Released to Cleanroom' | 'In Compounding' | 'Completed';
  fefoMaterialReady: boolean;
  qcApprovalStatus: 'Passed' | 'Pending' | 'Hold';
}

export interface MaterialLotReservation {
  id: string;
  lotNumber: string;
  materialName: string;
  expiryDate: string;
  physicalStockKg: number;
  reservedQtyKg: number;
  freeStockKg: number;
  moNumberAssigned: string;
  qcStatus: string;
}

export interface PpicScenario {
  id: string;
  scenarioName: string;
  description: string;
  salesGrowthFactorPct: number;
  supplierDelayDays: number;
  machineDowntimeHours: number;
  totalEstimatedMaterialCostIDR: number;
  totalProductionDays: number;
  predictedBottlenecksCount: number;
  projectedGrossProfitIDR: number;
}

export const initialDemandForecasts: DemandForecastItem[] = [
  {
    id: 'FCT-2026-001',
    productCode: 'FG-SRM-001',
    productName: 'CosmoGlow Intense Brightening Serum 30ml',
    category: 'Serum & Liquid',
    salesOrderQty: 18500,
    forecastQty: 11500,
    totalDemandQty: 30000,
    uom: 'Pcs',
    safetyStockTarget: 5000,
    currentStock: 3200,
    netDemandQty: 31800,
    period: 'Aug 2026',
    seasonalityFactor: 1.15,
    status: 'Approved',
  },
  {
    id: 'FCT-2026-002',
    productCode: 'FG-MOI-002',
    productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
    category: 'Cream & Emulsion',
    salesOrderQty: 14000,
    forecastQty: 11000,
    totalDemandQty: 25000,
    uom: 'Pcs',
    safetyStockTarget: 4000,
    currentStock: 4800,
    netDemandQty: 24200,
    period: 'Aug 2026',
    seasonalityFactor: 1.1,
    status: 'Approved',
  },
  {
    id: 'FCT-2026-003',
    productCode: 'FG-SUN-003',
    productName: 'UV-Shield Invisible Sunscreen SPF 50 50ml',
    category: 'Tube Packaging',
    salesOrderQty: 10000,
    forecastQty: 6000,
    totalDemandQty: 16000,
    uom: 'Pcs',
    safetyStockTarget: 3000,
    currentStock: 1200,
    netDemandQty: 17800,
    period: 'Aug 2026',
    seasonalityFactor: 1.25,
    status: 'Draft',
  },
];

export const initialMpsList: MpsItem[] = [
  {
    id: 'MPS-202608-01',
    mpsCode: 'MPS-SRM-01',
    productCode: 'FG-SRM-001',
    productName: 'CosmoGlow Intense Brightening Serum 30ml',
    formulaCode: 'FORM-SRM-BRIGHT-V3',
    productionLine: 'Line A (Serum & Liquid)',
    plannedQtyPcs: 30000,
    plannedBatchKg: 900,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    horizonPeriod: 'Weekly',
    freezeStatus: 'Frozen',
    approvalStatus: 'Approved',
    assignedMachine: 'Vacuum Emulsifier Tank 1000L (Vessel-01)',
    priority: 'High (Rush Order)',
  },
  {
    id: 'MPS-202608-02',
    mpsCode: 'MPS-MOI-02',
    productCode: 'FG-MOI-002',
    productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
    formulaCode: 'FORM-CRM-CERAMIDE-V2',
    productionLine: 'Line B (Cream & Emulsion)',
    plannedQtyPcs: 25000,
    plannedBatchKg: 1250,
    startDate: '2026-08-15',
    endDate: '2026-08-19',
    horizonPeriod: 'Weekly',
    freezeStatus: 'Slotted',
    approvalStatus: 'Approved',
    assignedMachine: 'High Shear Vacuum Emulsifier 1000L (Vessel-02)',
    priority: 'Normal',
  },
  {
    id: 'MPS-202608-03',
    mpsCode: 'MPS-SUN-03',
    productCode: 'FG-SUN-003',
    productName: 'UV-Shield Invisible Sunscreen SPF 50 50ml',
    formulaCode: 'FORM-SUN-SPF50-V1',
    productionLine: 'Line C (Tube Packaging)',
    plannedQtyPcs: 16000,
    plannedBatchKg: 800,
    startDate: '2026-08-20',
    endDate: '2026-08-23',
    horizonPeriod: 'Weekly',
    freezeStatus: 'Open Horizon',
    approvalStatus: 'Pending Approval',
    assignedMachine: 'High Shear Homogenizer 1500L (Vessel-03)',
    priority: 'Normal',
  },
];

export const initialMrpResults: MrpResultItem[] = [
  {
    id: 'MRP-001',
    materialCode: 'RM-ACT-001',
    materialName: 'Niacinamide USP Grade 99.5%',
    materialType: 'Active Ingredient',
    grossRequirementKgOrPcs: 27.0,
    availableStock: 15.0,
    reservedStock: 10.0,
    onOrderQty: 0,
    netRequirementQty: 22.0,
    uom: 'Kg',
    leadTimeDays: 14,
    supplierName: 'PT Specialty Chemical Indonesia',
    moqQty: 25,
    recommendationType: 'Generate Purchase Requisition (PR)',
    actionDueDate: '2026-08-10',
    estimatedCostIDR: 4950000,
    status: 'Critical Shortage',
  },
  {
    id: 'MRP-002',
    materialCode: 'RM-ACT-005',
    materialName: 'Centella Asiatica Extract Powder 98%',
    materialType: 'Active Ingredient',
    grossRequirementKgOrPcs: 13.5,
    availableStock: 13.0,
    reservedStock: 5.0,
    onOrderQty: 5.0,
    netRequirementQty: 0.5,
    uom: 'Kg',
    leadTimeDays: 21,
    supplierName: 'K-BioTech Co. Ltd Korea',
    moqQty: 10,
    recommendationType: 'Generate Purchase Requisition (PR)',
    actionDueDate: '2026-08-11',
    estimatedCostIDR: 8500000,
    status: 'Order Needed',
  },
  {
    id: 'MRP-003',
    materialCode: 'PKG-BOT-012',
    materialName: 'Botol Pipet Kaca Amber 30ml + Dropper Gold',
    materialType: 'Primary Packaging',
    grossRequirementKgOrPcs: 30000,
    availableStock: 35000,
    reservedStock: 30000,
    onOrderQty: 0,
    netRequirementQty: 0,
    uom: 'Pcs',
    leadTimeDays: 7,
    supplierName: 'PT Glass Packaging Nusantara',
    moqQty: 5000,
    recommendationType: 'Stock Sufficient',
    actionDueDate: '2026-08-18',
    estimatedCostIDR: 0,
    status: 'Sufficient',
  },
];

export const initialCrpCapacities: CrpCapacityItem[] = [
  {
    id: 'CRP-001',
    machineCode: 'VESSEL-01',
    machineName: 'Vacuum Emulsifier Tank 1000L',
    department: 'Compounding Line A',
    maxCapacityHoursPerWeek: 80,
    allocatedHours: 78,
    utilizationPercentage: 97.5,
    laborRequiredOperators: 2,
    laborAvailableOperators: 2,
    shiftMode: 'Shift 1 & 2 (16h)',
    bottleneckStatus: 'Critical Bottleneck',
  },
  {
    id: 'CRP-002',
    machineCode: 'VESSEL-02',
    machineName: 'High Shear Vacuum Emulsifier 1000L',
    department: 'Compounding Line B',
    maxCapacityHoursPerWeek: 80,
    allocatedHours: 62,
    utilizationPercentage: 77.5,
    laborRequiredOperators: 2,
    laborAvailableOperators: 2,
    shiftMode: 'Shift 1 & 2 (16h)',
    bottleneckStatus: 'Optimal',
  },
  {
    id: 'CRP-003',
    machineCode: 'FILL-LINE-01',
    machineName: 'Automatic Rotary Liquid Filling & Capping Line',
    department: 'Cleanroom Filling Grade D',
    maxCapacityHoursPerWeek: 80,
    allocatedHours: 68,
    utilizationPercentage: 85.0,
    laborRequiredOperators: 4,
    laborAvailableOperators: 4,
    shiftMode: 'Shift 1 & 2 (16h)',
    bottleneckStatus: 'Near Capacity',
  },
];

export const initialProductionSchedules: ProductionScheduleTask[] = [
  {
    id: 'SCH-001',
    moNumber: 'MO-20260810-001',
    productName: 'CosmoGlow Brightening Serum (Batch 1)',
    batchQtyKg: 450,
    targetPcs: 15000,
    machineVessel: 'Vacuum Emulsifier Tank 1000L (Vessel-01)',
    cleanroomGrade: 'Grade C (Compounding)',
    scheduledStartTime: '2026-08-10 08:00',
    scheduledEndTime: '2026-08-11 16:00',
    assignedOperator: 'Budi Santoso & Slamet R.',
    status: 'In Compounding',
    fefoMaterialReady: true,
    qcApprovalStatus: 'Passed',
  },
  {
    id: 'SCH-002',
    moNumber: 'MO-20260812-002',
    productName: 'HydroBarrier Moist Gel Cream (Batch 1)',
    batchQtyKg: 625,
    targetPcs: 12500,
    machineVessel: 'High Shear Vacuum Emulsifier 1000L (Vessel-02)',
    cleanroomGrade: 'Grade C (Compounding)',
    scheduledStartTime: '2026-08-12 08:00',
    scheduledEndTime: '2026-08-13 18:00',
    assignedOperator: 'Rian Hidayat & Agus T.',
    status: 'Released to Cleanroom',
    fefoMaterialReady: true,
    qcApprovalStatus: 'Passed',
  },
];

export const initialMaterialLotReservations: MaterialLotReservation[] = [
  {
    id: 'RES-001',
    lotNumber: 'LOT-NIA-202506-01',
    materialName: 'Niacinamide USP Grade 99.5%',
    expiryDate: '2027-06-30 (10 Bulan Lapis FEFO #1)',
    physicalStockKg: 25.0,
    reservedQtyKg: 10.0,
    freeStockKg: 15.0,
    moNumberAssigned: 'MO-20260810-001',
    qcStatus: '✓ Released QC Passed',
  },
  {
    id: 'RES-002',
    lotNumber: 'LOT-CEN-202509-02',
    materialName: 'Centella Asiatica Extract Powder 98%',
    expiryDate: '2027-09-15 (13 Bulan Lapis FEFO #1)',
    physicalStockKg: 18.0,
    reservedQtyKg: 5.0,
    freeStockKg: 13.0,
    moNumberAssigned: 'MO-20260810-001',
    qcStatus: '✓ Released QC Passed',
  },
];

export const initialPpicScenarios: PpicScenario[] = [
  {
    id: 'SCN-001',
    scenarioName: 'Skenario A: Normal Baseline Demand',
    description: 'Sesuai proyeksi penjualan regular kuartal III 2026.',
    salesGrowthFactorPct: 0,
    supplierDelayDays: 0,
    machineDowntimeHours: 0,
    totalEstimatedMaterialCostIDR: 485000000,
    totalProductionDays: 14,
    predictedBottlenecksCount: 1,
    projectedGrossProfitIDR: 620000000,
  },
  {
    id: 'SCN-002',
    scenarioName: 'Skenario B: Flash Sale TikTok +50% Demand Surge',
    description: 'Beban lonjakan order promosi e-commerce 9.9 Super Sale.',
    salesGrowthFactorPct: 50,
    supplierDelayDays: 3,
    machineDowntimeHours: 12,
    totalEstimatedMaterialCostIDR: 720000000,
    totalProductionDays: 21,
    predictedBottlenecksCount: 3,
    projectedGrossProfitIDR: 890000000,
  },
  {
    id: 'SCN-003',
    scenarioName: 'Skenario C: Impor Supplier Delay +21 Hari (Krisis Bahan Active)',
    description: 'Keterlambatan shiping bahan impor Niacinamide dari Jepang.',
    salesGrowthFactorPct: 0,
    supplierDelayDays: 21,
    machineDowntimeHours: 0,
    totalEstimatedMaterialCostIDR: 510000000,
    totalProductionDays: 28,
    predictedBottlenecksCount: 2,
    projectedGrossProfitIDR: 540000000,
  },
];
