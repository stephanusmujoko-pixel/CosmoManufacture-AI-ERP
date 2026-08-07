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
