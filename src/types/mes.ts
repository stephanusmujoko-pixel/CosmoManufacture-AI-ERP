export interface ManufacturingOrder {
  id: string;
  moNumber: string;
  productionPlanRef: string;
  factoryName: string;
  productionLine: string;
  productName: string;
  productCode: string;
  formulaCode: string;
  bomVersion: string;
  targetQtyUnits: number;
  targetBatchKg: number;
  targetYieldPercent: number;
  startDatePlan: string;
  finishDatePlan: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Approved' | 'In Production' | 'Planned' | 'Completed' | 'Hold';
  approvalStatus: 'Approved by Director' | 'Pending Approval' | 'Draft';
  clientName: string;
  estimatedCogsIdr?: number;
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  moNumber: string;
  operationName:
    | 'Raw Material Dispensing'
    | 'High Shear Compounding / Mixing'
    | 'Homogenization & Cooling'
    | 'In-Process Quality Hold'
    | 'Primary Bottle Filling & Dropper'
    | 'Secondary Boxing & Serialization';
  workCenter:
    | 'Cleanroom Class D - Vessel Station'
    | 'Cleanroom Class D - Filling Line'
    | 'Packaging Line B'
    | 'Cleanroom Class C - Sterile Station';
  machineName: string;
  assignedOperator: string;
  shift: 'Shift 1 (08:00 - 16:00)' | 'Shift 2 (16:00 - 00:00)' | 'Shift 3 (00:00 - 08:00)';
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  status: 'In Progress' | 'Ready to Start' | 'Completed' | 'Paused' | 'On Hold';
  progressPercent: number;
}

export interface ElectronicBatchRecordItem {
  id: string;
  batchNumber: string;
  moNumber: string;
  productName: string;
  formulaVersion: string;
  batchSizeKg: number;
  manufactureDate: string;
  expiryDate: string;
  operatorLead: string;
  supervisorSign: string;
  lineClearanceApproved: boolean;
  qcInProcessStatus: 'Passed' | 'In Testing' | 'Hold';
  processParameters: {
    temperatureC: number;
    targetTempC: number;
    mixingRpm: number;
    targetRpm: number;
    vacuumBar: number;
    mixingTimeMinutes: number;
    currentPh: number;
    targetPhMin: number;
    targetPhMax: number;
    viscosityCps: number;
  };
  digitalSignatureStatus: 'Signed & Sealed' | 'Awaiting QA Approval' | 'Draft';
  status: 'In Production' | 'Released' | 'Quarantine';
  auditLogs?: { timestamp: string; user: string; action: string }[];
}

export interface ShopFloorStation {
  id: string;
  code: string;
  name: string;
  line: string;
  cleanroomClass: 'Class D' | 'Class C' | 'Class B' | 'General Area';
  status: 'Running' | 'Idle' | 'CIP Cleaning' | 'Maintenance' | 'Hold';
  currentMo?: string;
  currentBatch?: string;
  operator?: string;
  temperatureC: number;
  targetTempC: number;
  mixingRpm: number;
  targetRpm: number;
  vacuumBar: number;
  targetVacuumBar: number;
  currentPh: number;
  viscosityCps: number;
  progressPercent: number;
}

export interface MaterialDispensingItem {
  id: string;
  moNumber: string;
  batchNumber: string;
  rawMaterialCode: string;
  rawMaterialName: string;
  phase: 'A (Water Phase)' | 'B (Oil Phase)' | 'C (Active Phase)' | 'D (Fragrance/Preservative)';
  lotNumber: string;
  targetQtyKg: number;
  actualQtyKg: number;
  tolerancePercent: number;
  operatorName: string;
  scaleId: string;
  status: 'Pending' | 'Weighed & Verified' | 'Over Tolerance' | 'Issued';
  scannedQr: boolean;
  weighedAt?: string;
}

export interface YieldWasteRecord {
  id: string;
  moNumber: string;
  batchNumber: string;
  productName: string;
  targetBulkKg: number;
  actualBulkKg: number;
  bulkYieldPercent: number;
  targetUnits: number;
  actualUnits: number;
  filledYieldPercent: number;
  scrapKg: number;
  scrapUnits: number;
  primaryScrapReason:
    | 'Purging & Piping Residual'
    | 'Quality Hold Sample'
    | 'Bottle Damage / Reject'
    | 'Spill during Dispensing'
    | 'Filter Holding Tank Loss';
  scrapCostIdr: number;
  operatorNotes: string;
}

export interface ProductionDeviation {
  id: string;
  devNumber: string;
  moNumber: string;
  batchNumber: string;
  type: 'Temperature Spike' | 'Viscosity Out-of-Spec' | 'Yield Loss > 3%' | 'Machine Mechanical Jam' | 'Contamination Risk';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  rootCause: string;
  capaAction: string;
  reportedBy: string;
  reportedAt: string;
  approvalStatus: 'QA Approved' | 'Under Investigation' | 'Pending Review';
}

export interface DowntimeLog {
  id: string;
  machineCode: string;
  machineName: string;
  category:
    | 'Machine Breakdown'
    | 'Material Shortage'
    | 'Line Cleaning & Sanitization'
    | 'QC Hold'
    | 'Setup & Changeover';
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  reasonNotes: string;
  status: 'Resolved' | 'Active Downtime';
}

export interface OeeMetric {
  machineCode: string;
  machineName: string;
  availabilityPercent: number;
  performancePercent: number;
  qualityPercent: number;
  overallOeePercent: number;
  status: 'Optimal' | 'Warning' | 'Critical';
}

export interface LineClearanceChecklist {
  stationId: string;
  stationName: string;
  cleaningVerified: boolean;
  equipmentCalibrated: boolean;
  materialsValidated: boolean;
  previousLotRemoved: boolean;
  operatorCompetent: boolean;
  verifiedBy: string;
  verifiedAt: string;
  status: 'Verified CPKB' | 'Pending Inspection';
}
