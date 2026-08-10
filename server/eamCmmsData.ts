export interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'Production Equipment' | 'Laboratory Instrument' | 'Utility System' | 'Facility & Building' | 'Vehicle & Transport';
  hierarchyLocation: string; // e.g., "Factory 1 > Cleanroom A > Line 2 > Emulsifier Machine"
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  purchaseDate: string;
  purchaseCostIdr: number;
  warrantyExpiry: string;
  lifecycleStage: 'Planning' | 'Procurement' | 'Installation' | 'Commissioning' | 'Operation' | 'Maintenance' | 'Upgrade' | 'Retirement' | 'Disposal';
  status: 'In Service' | 'Under Maintenance' | 'Calibration Due' | 'Out of Service' | 'Decommissioned';
  assignedTechnician: string;
  criticality: 'High (Critical)' | 'Medium' | 'Low';
}

export interface MachineRegister {
  id: string;
  machineCode: string;
  machineName: string;
  lineLocation: string;
  powerRatingKw: number;
  runtimeHours: number;
  oeeAvailabilityPercent: number;
  mtbfHours: number;
  mttrHours: number;
  lastMaintenanceDate: string;
  nextPreventiveDate: string;
  calibrationRequired: boolean;
  calibrationExpiryDate?: string;
  status: 'Running' | 'Standby' | 'Breakdown' | 'Maintenance';
}

export interface MaintenanceWorkOrder {
  id: string;
  woNumber: string;
  requestNumber?: string;
  assetId: string;
  assetName: string;
  machineCode: string;
  location: string;
  category: 'Preventive' | 'Predictive' | 'Corrective' | 'Emergency' | 'Breakdown' | 'Shutdown';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  problemDescription: string;
  rootCause?: string;
  assignedTechnician: string;
  supervisor: string;
  requestDate: string;
  scheduledDate: string;
  estimatedHours: number;
  actualHours?: number;
  status: 'Pending Approval' | 'Approved' | 'In Progress' | 'On Hold (Parts)' | 'Completed' | 'Verified & Closed';
  sparePartsUsed?: Array<{ partCode: string; partName: string; qtyUsed: number; costIdr: number }>;
  totalCostIdr: number;
}

export interface CalibrationRecord {
  id: string;
  calibrationCode: string;
  assetId: string;
  instrumentName: string;
  serialNumber: string;
  location: string;
  calibrationType: 'Internal Lab' | 'External Accredited (KAN / ISO 17025)';
  serviceProvider: string;
  lastCalibrationDate: string;
  nextDueDate: string;
  certificateNumber: string;
  result: 'Passed (Qualified)' | 'Conditional Pass' | 'Failed (Out of Spec)';
  status: 'Valid' | 'Due Soon' | 'Expired' | 'Under Calibration';
  validatedByQc: boolean;
}

export interface SparePartMaster {
  id: string;
  partCode: string;
  partName: string;
  category: 'Mechanical Seal' | 'Electrical Sensor' | 'Pneumatic Valve' | 'Filter Cartridge' | 'Lubricant Grade' | 'Heating Element';
  compatibleMachines: string[];
  stockQuantity: number;
  minReorderPoint: number;
  unitCostIdr: number;
  supplierName: string;
  storageBinLocation: string;
  isCritical: boolean;
}

export interface UtilityAsset {
  id: string;
  utilityCode: string;
  utilityName: string;
  category: 'HVAC Cleanroom System' | 'Purified Water System (PW/WFI)' | 'Boiler & Steam' | 'Compressed Air' | 'Chiller Unit' | 'Power Generator & UPS';
  capacityRating: string;
  location: string;
  currentLoadPercent: number;
  energyConsumptionTodayKwh: number;
  waterConsumptionTodayM3: number;
  status: 'Optimal' | 'Alert' | 'Servicing Required';
}

export interface EnergyLog {
  id: string;
  timestamp: string;
  facilityArea: string;
  electricityKwh: number;
  waterM3: number;
  steamKg: number;
  compressedAirM3: number;
  costEstimateIdr: number;
}

export interface OeeRecord {
  id: string;
  machineCode: string;
  machineName: string;
  lineLocation: string;
  date: string;
  plannedOperatingMinutes: number;
  actualOperatingMinutes: number;
  downtimeMinutes: number;
  idealCycleTimeSeconds: number;
  totalOutputUnits: number;
  goodOutputUnits: number;
  rejectUnits: number;
  availabilityPercent: number;
  performancePercent: number;
  qualityPercent: number;
  oeePercent: number;
  sixBigLosses: {
    breakdownMinutes: number;
    changeoverMinutes: number;
    minorStopsMinutes: number;
    speedLossMinutes: number;
    defectLossMinutes: number;
    startupLossMinutes: number;
  };
}

export interface DowntimeLog {
  id: string;
  downtimeCode: string;
  machineCode: string;
  machineName: string;
  timestamp: string;
  durationMinutes: number;
  category: 'Breakdown' | 'Changeover & Setup' | 'Minor Stop / Jamming' | 'No Raw Material' | 'Quality Issue' | 'Utility Failure';
  rootCause: string;
  operatorName: string;
  technicianAssigned?: string;
  status: 'Open' | 'Resolved' | 'Under Investigation';
}

export interface AutonomousChecklist {
  id: string;
  checklistCode: string;
  machineCode: string;
  machineName: string;
  shift: 'Shift 1' | 'Shift 2' | 'Shift 3';
  operatorName: string;
  supervisorName: string;
  date: string;
  items: Array<{
    id: string;
    checkPoint: string;
    standardCategory: 'Clean (Pembersihan)' | 'Inspect (Pemeriksaan)' | 'Lubrication (Pelumasan)' | 'Tighten (Pengencangan)';
    method: string;
    result: 'Pass' | 'Fail' | 'Pending';
    remarks?: string;
  }>;
  status: 'Completed' | 'Pending Leader Sign-Off' | 'Failed (Action Required)';
}

export interface PreventiveSchedule {
  id: string;
  scheduleCode: string;
  machineCode: string;
  machineName: string;
  taskTitle: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  nextDueDate: string;
  estimatedHours: number;
  assignedTechnician: string;
  criticality: 'High' | 'Medium' | 'Low';
  lastDoneDate: string;
  status: 'Scheduled' | 'WO Created' | 'Completed' | 'Overdue';
}

// Initial Mock Datasets
export const initialAssets: Asset[] = [
  {
    id: 'asset-1',
    assetCode: 'AST-PROD-VAC-01',
    assetName: 'Cosmetic Vacuum Homogenizer Mixer 1000L',
    category: 'Production Equipment',
    hierarchyLocation: 'Factory 1 > Cleanroom Level 2 > Processing Line A > Mixing Station',
    serialNumber: 'VAC-HOMO-2024-88',
    manufacturer: 'PT Indofood Machinery / FrymaKoruma Tech',
    modelNumber: 'VAK-1000L-GMP',
    purchaseDate: '2024-03-15',
    purchaseCostIdr: 1250000000,
    warrantyExpiry: '2027-03-15',
    lifecycleStage: 'Operation',
    status: 'In Service',
    assignedTechnician: 'Hendra Setiawan (Sr. Tech)',
    criticality: 'High (Critical)',
  },
  {
    id: 'asset-2',
    assetCode: 'AST-LAB-HPLC-02',
    assetName: 'High Performance Liquid Chromatography (HPLC) Agilent 1260',
    category: 'Laboratory Instrument',
    hierarchyLocation: 'Factory 1 > Quality Control Lab > Instrument Room 3',
    serialNumber: 'HPLC-AG-99120',
    manufacturer: 'Agilent Technologies',
    modelNumber: '1260 Infinity II',
    purchaseDate: '2023-08-10',
    purchaseCostIdr: 850000000,
    warrantyExpiry: '2026-08-10',
    lifecycleStage: 'Operation',
    status: 'Calibration Due',
    assignedTechnician: 'Lestari (QA/Lab Technician)',
    criticality: 'High (Critical)',
  },
  {
    id: 'asset-3',
    assetCode: 'AST-UTIL-HVAC-01',
    assetName: 'Class 100,000 Cleanroom HVAC Air Handling Unit (AHU)',
    category: 'Utility System',
    hierarchyLocation: 'Factory 1 > Utility Roof Deck > AHU Room 1',
    serialNumber: 'AHU-CR-5500',
    manufacturer: 'Daikin Applied',
    modelNumber: 'AHU-GMP-10K',
    purchaseDate: '2022-11-20',
    purchaseCostIdr: 680000000,
    warrantyExpiry: '2025-11-20',
    lifecycleStage: 'Maintenance',
    status: 'Under Maintenance',
    assignedTechnician: 'Bambang Suprianto (HVAC Tech)',
    criticality: 'High (Critical)',
  },
];

export const initialMachines: MachineRegister[] = [
  {
    id: 'mach-1',
    machineCode: 'MCH-MIX-01',
    machineName: 'Vacuum Homogenizer 1000L (Main Emulsifier)',
    lineLocation: 'Processing Line A',
    powerRatingKw: 45.0,
    runtimeHours: 3420,
    oeeAvailabilityPercent: 94.2,
    mtbfHours: 480,
    mttrHours: 2.1,
    lastMaintenanceDate: '2026-07-15',
    nextPreventiveDate: '2026-08-15',
    calibrationRequired: true,
    calibrationExpiryDate: '2026-11-30',
    status: 'Running',
  },
  {
    id: 'mach-2',
    machineCode: 'MCH-FILL-02',
    machineName: 'Automatic Rotary 8-Head Liquid Bottle Filler',
    lineLocation: 'Packaging Line 2',
    powerRatingKw: 18.5,
    runtimeHours: 2890,
    oeeAvailabilityPercent: 91.5,
    mtbfHours: 360,
    mttrHours: 1.8,
    lastMaintenanceDate: '2026-07-20',
    nextPreventiveDate: '2026-08-20',
    calibrationRequired: true,
    calibrationExpiryDate: '2026-10-15',
    status: 'Running',
  },
  {
    id: 'mach-3',
    machineCode: 'MCH-RO-WATER-01',
    machineName: 'Purified Water System RO + EDI 2000L/H',
    lineLocation: 'Utility Plant Room',
    powerRatingKw: 30.0,
    runtimeHours: 6200,
    oeeAvailabilityPercent: 98.8,
    mtbfHours: 720,
    mttrHours: 3.5,
    lastMaintenanceDate: '2026-07-01',
    nextPreventiveDate: '2026-08-01',
    calibrationRequired: true,
    calibrationExpiryDate: '2026-09-01',
    status: 'Standby',
  },
];

export const initialWorkOrders: MaintenanceWorkOrder[] = [
  {
    id: 'wo-1',
    woNumber: 'WO-2026-0801',
    requestNumber: 'REQ-2026-102',
    assetId: 'asset-1',
    assetName: 'Cosmetic Vacuum Homogenizer Mixer 1000L',
    machineCode: 'MCH-MIX-01',
    location: 'Processing Line A',
    category: 'Preventive',
    priority: 'High',
    problemDescription: 'Monthly PM Inspection: Check mechanical seal lubrication, vacuum pump pressure & heating jacket coils.',
    assignedTechnician: 'Hendra Setiawan',
    supervisor: 'Bambang Suprianto (Maintenance Mgr)',
    requestDate: '2026-08-01',
    scheduledDate: '2026-08-05',
    estimatedHours: 4.0,
    actualHours: 3.5,
    status: 'Verified & Closed',
    sparePartsUsed: [
      { partCode: 'PRT-SEAL-01', partName: 'Teflon Mechanical Seal Ring', qtyUsed: 2, costIdr: 450000 },
      { partCode: 'PRT-LUB-FOOD', partName: 'NSF H1 Food Grade Synthetic Grease 1kg', qtyUsed: 1, costIdr: 320000 },
    ],
    totalCostIdr: 1220000,
  },
  {
    id: 'wo-2',
    woNumber: 'WO-2026-0805',
    requestNumber: 'REQ-2026-109',
    assetId: 'asset-3',
    assetName: 'Class 100,000 Cleanroom HVAC Air Handling Unit (AHU)',
    machineCode: 'MCH-AHU-01',
    location: 'Utility Roof Deck',
    category: 'Corrective',
    priority: 'Urgent',
    problemDescription: 'High differential pressure alert across HEPA filters in Cleanroom Processing Line A.',
    assignedTechnician: 'Bambang Suprianto',
    supervisor: 'Bambang Suprianto',
    requestDate: '2026-08-04',
    scheduledDate: '2026-08-05',
    estimatedHours: 6.0,
    actualHours: 5.0,
    status: 'In Progress',
    sparePartsUsed: [
      { partCode: 'PRT-HEPA-H14', partName: 'HEPA Filter Module H14 610x610x292mm', qtyUsed: 4, costIdr: 6800000 },
    ],
    totalCostIdr: 6800000,
  },
];

export const initialCalibrations: CalibrationRecord[] = [
  {
    id: 'cal-1',
    calibrationCode: 'CAL-2026-044',
    assetId: 'asset-2',
    instrumentName: 'HPLC Agilent 1260 UV/Vis Detector & Flow Meter',
    serialNumber: 'HPLC-AG-99120',
    location: 'QC Chemistry Lab',
    calibrationType: 'External Accredited (KAN / ISO 17025)',
    serviceProvider: 'PT BSN Kalibrasi Indonesia',
    lastCalibrationDate: '2025-08-15',
    nextDueDate: '2026-08-15',
    certificateNumber: 'KAN-CERT-2025-8819',
    result: 'Passed (Qualified)',
    status: 'Due Soon',
    validatedByQc: true,
  },
  {
    id: 'cal-2',
    calibrationCode: 'CAL-2026-012',
    assetId: 'asset-1',
    instrumentName: 'Temperature & Vacuum Pressure Sensor Transmitter',
    serialNumber: 'SENS-VAC-001',
    location: 'Processing Line A',
    calibrationType: 'Internal Lab',
    serviceProvider: 'Internal Metrology Specialist',
    lastCalibrationDate: '2026-02-10',
    nextDueDate: '2027-02-10',
    certificateNumber: 'INT-CAL-2026-012',
    result: 'Passed (Qualified)',
    status: 'Valid',
    validatedByQc: true,
  },
];

export const initialSpareParts: SparePartMaster[] = [
  {
    id: 'sp-1',
    partCode: 'PRT-SEAL-01',
    partName: 'Teflon High-Temp Mechanical Seal Ring 50mm',
    category: 'Mechanical Seal',
    compatibleMachines: ['MCH-MIX-01', 'MCH-HOMO-02'],
    stockQuantity: 18,
    minReorderPoint: 5,
    unitCostIdr: 225000,
    supplierName: 'PT Seal Tech Indonesia',
    storageBinLocation: 'Rack B-04-02',
    isCritical: true,
  },
  {
    id: 'sp-2',
    partCode: 'PRT-HEPA-H14',
    partName: 'HEPA Filter Module H14 (99.995% Efficiency)',
    category: 'Filter Cartridge',
    compatibleMachines: ['MCH-AHU-01', 'MCH-LAMINAR-03'],
    stockQuantity: 3,
    minReorderPoint: 4,
    unitCostIdr: 1700000,
    supplierName: 'PT Clean Air Systems',
    storageBinLocation: 'Warehouse Utility Zone C',
    isCritical: true,
  },
  {
    id: 'sp-3',
    partCode: 'PRT-SENS-PT100',
    partName: 'PT100 Temperature Sensor Probe Sanitary Tri-Clamp',
    category: 'Electrical Sensor',
    compatibleMachines: ['MCH-MIX-01', 'MCH-TANKS-04'],
    stockQuantity: 12,
    minReorderPoint: 3,
    unitCostIdr: 480000,
    supplierName: 'PT Automation Controls',
    storageBinLocation: 'Rack E-01-08',
    isCritical: false,
  },
];

export const initialUtilities: UtilityAsset[] = [
  {
    id: 'util-1',
    utilityCode: 'UTL-AHU-CLEANROOM',
    utilityName: 'Cleanroom Grade AHU & Dehumidifier Cluster',
    category: 'HVAC Cleanroom System',
    capacityRating: '45,000 CFM (ISO Class 7/8)',
    location: 'Utility Roof Deck A',
    currentLoadPercent: 82,
    energyConsumptionTodayKwh: 480,
    waterConsumptionTodayM3: 12.5,
    status: 'Servicing Required',
  },
  {
    id: 'util-2',
    utilityCode: 'UTL-WATER-PW-01',
    utilityName: 'GMP Purified Water (PW) & Loop System 2000L/h',
    category: 'Purified Water System (PW/WFI)',
    capacityRating: '2,000 Liters / Hour',
    location: 'Water Treatment Plant Room',
    currentLoadPercent: 65,
    energyConsumptionTodayKwh: 220,
    waterConsumptionTodayM3: 45.0,
    status: 'Optimal',
  },
  {
    id: 'util-3',
    utilityCode: 'UTL-BOILER-STEAM-01',
    utilityName: 'Industrial Gas Boiler Steam Generator 2 Ton/h',
    category: 'Boiler & Steam',
    capacityRating: '2.0 Tons Steam / Hour @ 8 Bar',
    location: 'Boiler House Zone B',
    currentLoadPercent: 74,
    energyConsumptionTodayKwh: 310,
    waterConsumptionTodayM3: 18.2,
    status: 'Optimal',
  },
];

export const initialEnergyLogs: EnergyLog[] = [
  {
    id: 'eng-1',
    timestamp: '2026-08-06 18:00',
    facilityArea: 'Processing Cleanroom Line A & B',
    electricityKwh: 1240,
    waterM3: 38.5,
    steamKg: 2400,
    compressedAirM3: 1850,
    costEstimateIdr: 2850000,
  },
  {
    id: 'eng-2',
    timestamp: '2026-08-06 12:00',
    facilityArea: 'Packaging Lines 1-4 & Warehouse',
    electricityKwh: 980,
    waterM3: 14.2,
    steamKg: 800,
    compressedAirM3: 2100,
    costEstimateIdr: 1950000,
  },
];

export const initialOeeRecords: OeeRecord[] = [
  {
    id: 'oee-1',
    machineCode: 'MCH-MIX-01',
    machineName: 'Vacuum Homogenizer 1000L',
    lineLocation: 'Processing Line A (Cleanroom)',
    date: '2026-08-08',
    plannedOperatingMinutes: 480,
    actualOperatingMinutes: 450,
    downtimeMinutes: 30,
    idealCycleTimeSeconds: 1.2,
    totalOutputUnits: 21500,
    goodOutputUnits: 21100,
    rejectUnits: 400,
    availabilityPercent: 93.75,
    performancePercent: 95.55,
    qualityPercent: 98.14,
    oeePercent: 87.91,
    sixBigLosses: {
      breakdownMinutes: 15,
      changeoverMinutes: 10,
      minorStopsMinutes: 5,
      speedLossMinutes: 8,
      defectLossMinutes: 6,
      startupLossMinutes: 4,
    },
  },
  {
    id: 'oee-2',
    machineCode: 'MCH-FILL-02',
    machineName: 'Rotary 8-Head Bottle Filler',
    lineLocation: 'Packaging Line 2',
    date: '2026-08-08',
    plannedOperatingMinutes: 480,
    actualOperatingMinutes: 420,
    downtimeMinutes: 60,
    idealCycleTimeSeconds: 0.8,
    totalOutputUnits: 30000,
    goodOutputUnits: 29550,
    rejectUnits: 450,
    availabilityPercent: 87.50,
    performancePercent: 95.24,
    qualityPercent: 98.50,
    oeePercent: 82.08,
    sixBigLosses: {
      breakdownMinutes: 35,
      changeoverMinutes: 15,
      minorStopsMinutes: 10,
      speedLossMinutes: 12,
      defectLossMinutes: 8,
      startupLossMinutes: 5,
    },
  },
  {
    id: 'oee-3',
    machineCode: 'MCH-RO-WATER-01',
    machineName: 'PW System RO + EDI 2000L/H',
    lineLocation: 'Utility Plant Room',
    date: '2026-08-08',
    plannedOperatingMinutes: 480,
    actualOperatingMinutes: 475,
    downtimeMinutes: 5,
    idealCycleTimeSeconds: 1.0,
    totalOutputUnits: 28500,
    goodOutputUnits: 28480,
    rejectUnits: 20,
    availabilityPercent: 98.96,
    performancePercent: 100.0,
    qualityPercent: 99.93,
    oeePercent: 98.89,
    sixBigLosses: {
      breakdownMinutes: 0,
      changeoverMinutes: 0,
      minorStopsMinutes: 5,
      speedLossMinutes: 0,
      defectLossMinutes: 1,
      startupLossMinutes: 0,
    },
  },
];

export const initialDowntimeLogs: DowntimeLog[] = [
  {
    id: 'dt-1',
    downtimeCode: 'DT-2026-001',
    machineCode: 'MCH-MIX-01',
    machineName: 'Vacuum Homogenizer 1000L',
    timestamp: '2026-08-08 09:15',
    durationMinutes: 15,
    category: 'Minor Stop / Jamming',
    rootCause: 'Vacuum valve seal sensor dirty - cleared and recalibrated by operator.',
    operatorName: 'Ahmad Fauzi (Operator Line A)',
    technicianAssigned: 'Hendra Setiawan',
    status: 'Resolved',
  },
  {
    id: 'dt-2',
    downtimeCode: 'DT-2026-002',
    machineCode: 'MCH-FILL-02',
    machineName: 'Rotary 8-Head Bottle Filler',
    timestamp: '2026-08-08 11:30',
    durationMinutes: 35,
    category: 'Changeover & Setup',
    rootCause: 'Product changeover from Whitening Serum 30ml to Barrier Cream 50ml jar & nozzle nozzle cleaning CIP.',
    operatorName: 'Rudi Hartono',
    technicianAssigned: 'Bambang Suprianto',
    status: 'Resolved',
  },
];

export const initialAutonomousChecklists: AutonomousChecklist[] = [
  {
    id: 'am-1',
    checklistCode: 'AM-MIX01-20260808',
    machineCode: 'MCH-MIX-01',
    machineName: 'Vacuum Homogenizer 1000L',
    shift: 'Shift 1',
    operatorName: 'Ahmad Fauzi',
    supervisorName: 'Bambang Suprianto',
    date: '2026-08-08',
    status: 'Completed',
    items: [
      { id: 'item-1', checkPoint: 'Kebersihan Body Tank & Glass Sight (Sanitasi CIP)', standardCategory: 'Clean (Pembersihan)', method: 'Visual Audit', result: 'Pass' },
      { id: 'item-2', checkPoint: 'Tekanan Suction Vacuum Pump (-0.09 MPa)', standardCategory: 'Inspect (Pemeriksaan)', method: 'Gauge Indicator', result: 'Pass' },
      { id: 'item-3', checkPoint: 'Pelumasan Shaft Mechanical Seal (Food Grade H1 Grease)', standardCategory: 'Lubrication (Pelumasan)', method: 'Grease Nipple Inspection', result: 'Pass' },
      { id: 'item-4', checkPoint: 'Pengencangan Clamp Tri-Clover Piping Valve', standardCategory: 'Tighten (Pengencangan)', method: 'Manual Wrench Check', result: 'Pass' },
    ],
  },
  {
    id: 'am-2',
    checklistCode: 'AM-FILL02-20260808',
    machineCode: 'MCH-FILL-02',
    machineName: 'Rotary 8-Head Bottle Filler',
    shift: 'Shift 1',
    operatorName: 'Rudi Hartono',
    supervisorName: 'Bambang Suprianto',
    date: '2026-08-08',
    status: 'Pending Leader Sign-Off',
    items: [
      { id: 'item-1', checkPoint: 'Pembersihan Nozzle Piston & Anti-Drip Tray', standardCategory: 'Clean (Pembersihan)', method: 'Alcohol Wipe 70%', result: 'Pass' },
      { id: 'item-2', checkPoint: 'Pemeriksaan Sensor Fotoelektrik Keberadaan Botol', standardCategory: 'Inspect (Pemeriksaan)', method: 'Test Trigger', result: 'Pass' },
      { id: 'item-3', checkPoint: 'Pengencangan Conveyor Belt Guide Rail', standardCategory: 'Tighten (Pengencangan)', method: 'Hex Key Tighten', result: 'Pass' },
    ],
  },
];

export const initialPmSchedules: PreventiveSchedule[] = [
  {
    id: 'pm-1',
    scheduleCode: 'PMS-MIX01-M08',
    machineCode: 'MCH-MIX-01',
    machineName: 'Vacuum Homogenizer 1000L',
    taskTitle: 'Bulanan: Overhaul Mechanical Seal, Ganti Filter Vacuum & Cek V-Belt Mixer',
    frequency: 'Monthly',
    nextDueDate: '2026-08-15',
    estimatedHours: 4.0,
    assignedTechnician: 'Hendra Setiawan',
    criticality: 'High',
    lastDoneDate: '2026-07-15',
    status: 'Scheduled',
  },
  {
    id: 'pm-2',
    scheduleCode: 'PMS-FILL02-W32',
    machineCode: 'MCH-FILL-02',
    machineName: 'Rotary 8-Head Bottle Filler',
    taskTitle: 'Mingguan: Kalibrasi Volume Dispensing Piston & Penggantian O-Ring Nozzle',
    frequency: 'Weekly',
    nextDueDate: '2026-08-12',
    estimatedHours: 2.0,
    assignedTechnician: 'Bambang Suprianto',
    criticality: 'Medium',
    lastDoneDate: '2026-08-05',
    status: 'Scheduled',
  },
  {
    id: 'pm-3',
    scheduleCode: 'PMS-AHU01-Q3',
    machineCode: 'MCH-AHU-01',
    machineName: 'Cleanroom HVAC AHU Unit',
    taskTitle: 'Triwulan: Validasi HEPA Filter Differential Pressure & Chilled Water Coil Flushing',
    frequency: 'Quarterly',
    nextDueDate: '2026-08-20',
    estimatedHours: 6.0,
    assignedTechnician: 'Bambang Suprianto',
    criticality: 'High',
    lastDoneDate: '2026-05-20',
    status: 'Scheduled',
  },
];
