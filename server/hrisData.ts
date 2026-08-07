export interface Employee {
  id: string;
  employeeId: string; // e.g. "EMP-2026-001"
  nik: string;
  fullName: string;
  photoUrl?: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  religion: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  email: string;
  phone: string;
  department: 'Factory Production' | 'R&D Formula Lab' | 'Quality Control' | 'Maintenance' | 'PPIC & Warehouse' | 'Sales & Marketing' | 'Finance & HR';
  position: string;
  jobGrade: 'G1 Operator' | 'G2 Senior Tech' | 'G3 Supervisor' | 'G4 Manager' | 'G5 Director';
  managerName: string;
  employmentStatus: 'Permanent' | 'Contract' | 'Probation';
  hireDate: string;
  bpjsKesehatanNo: string;
  bpjsKetenagakerjaanNo: string;
  npwpNo: string;
  bankAccountNo: string;
  bankName: string;
  basicSalaryIdr: number;
  positionAllowanceIdr: number;
  transportAllowanceIdr: number;
  mealAllowanceIdr: number;
  machineQualificationCertificates: string[]; // e.g. ["MCH-MIX-01 Homogenizer", "LAB-HPLC-01"]
  status: 'Active' | 'Resigned' | 'On Leave';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  shiftName: 'Shift 1 (07:00 - 15:00)' | 'Shift 2 (15:00 - 23:00)' | 'Shift 3 (23:00 - 07:00)' | 'Office (08:00 - 17:00)';
  checkInTime: string;
  checkOutTime: string;
  checkInStatus: 'On Time' | 'Late Check-in' | 'Absent';
  checkInMethod: 'Face Recognition' | 'GPS Mobile ESS' | 'Fingerprint';
  locationGps: string;
  cleanroomGateVerified: boolean;
}

export interface LeaveRequest {
  id: string;
  leaveCode: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Special Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  approvalStatus: 'Approved' | 'Pending Approval' | 'Rejected';
  approvedBy: string;
}

export interface OvertimeRequest {
  id: string;
  otCode: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  hours: number;
  reason: string;
  overtimeMultiplier: number; // e.g., 1.5, 2.0
  calculatedOtPayIdr: number;
  approvalStatus: 'Approved' | 'Pending Approval' | 'Rejected';
  approvedBy: string;
}

export interface PayrollTransaction {
  id: string;
  payrollPeriod: string; // e.g. "2026-08"
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  basicSalaryIdr: number;
  allowancesTotalIdr: number;
  overtimePayIdr: number;
  grossSalaryIdr: number;
  bpjsKesehatanDeductionIdr: number; // 1% employee
  bpjsKetenagakerjaanDeductionIdr: number; // 2% JHT
  pph21TaxDeductionIdr: number;
  otherDeductionIdr: number;
  netTakeHomePayIdr: number;
  paymentStatus: 'Processed' | 'Draft' | 'Paid';
  paymentDate: string;
}

export interface TrainingProgram {
  id: string;
  trainingCode: string;
  title: string;
  category: 'CPKB Cleanroom ISO 22716' | 'Chemical Safety & Formulation' | 'EAM Maintenance' | 'GMP Hygiene' | 'Leadership';
  instructor: string;
  startDate: string;
  endDate: string;
  enrolledCount: number;
  status: 'Completed' | 'Upcoming' | 'In Progress';
}

export interface PerformanceKpi {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  kpiTitle: string;
  targetMetric: string; // e.g. "Yield Mixing >= 98%"
  actualAchieved: string; // e.g. "98.8%"
  scorePct: number; // e.g. 102%
  evaluationGrade: 'A - Outstanding' | 'B - Meets Expectation' | 'C - Needs Improvement';
  evaluatorName: string;
}

export const initialEmployees: Employee[] = [
  {
    id: 'emp-01',
    employeeId: 'EMP-2026-001',
    nik: '3275011208900001',
    fullName: 'Dr. Hendra Wijaya, M.Si.',
    gender: 'Male',
    birthDate: '1988-05-12',
    religion: 'Islam',
    maritalStatus: 'Married',
    email: 'hendra.w@cosmomanufacture.co.id',
    phone: '0812-9876-5432',
    department: 'R&D Formula Lab',
    position: 'R&D Formulation Manager',
    jobGrade: 'G4 Manager',
    managerName: 'Direktur Ops',
    employmentStatus: 'Permanent',
    hireDate: '2021-03-01',
    bpjsKesehatanNo: '000188291022',
    bpjsKetenagakerjaanNo: '21098812902',
    npwpNo: '88.192.301.2-412.000',
    bankAccountNo: '8830912001',
    bankName: 'Bank BCA',
    basicSalaryIdr: 28000000,
    positionAllowanceIdr: 5000000,
    transportAllowanceIdr: 1500000,
    mealAllowanceIdr: 1000000,
    machineQualificationCertificates: ['LAB-HPLC-01 Shimadzu', 'LAB-VISCO-02 Viscometer'],
    status: 'Active',
  },
  {
    id: 'emp-02',
    employeeId: 'EMP-2026-002',
    nik: '3275012509920003',
    fullName: 'Rian Hidayat, S.ST.',
    gender: 'Male',
    birthDate: '1992-09-25',
    religion: 'Islam',
    maritalStatus: 'Married',
    email: 'rian.h@cosmomanufacture.co.id',
    phone: '0856-1122-3344',
    department: 'Factory Production',
    position: 'Senior MES Homogenizer Operator',
    jobGrade: 'G2 Senior Tech',
    managerName: 'Agus Santoso (Prod SPV)',
    employmentStatus: 'Permanent',
    hireDate: '2022-06-15',
    bpjsKesehatanNo: '000199201923',
    bpjsKetenagakerjaanNo: '22019920192',
    npwpNo: '91.822.102.1-412.000',
    bankAccountNo: '8830912088',
    bankName: 'Bank BCA',
    basicSalaryIdr: 9500000,
    positionAllowanceIdr: 1200000,
    transportAllowanceIdr: 800000,
    mealAllowanceIdr: 750000,
    machineQualificationCertificates: ['MCH-MIX-01 Vacuum Homogenizer 1000L', 'MCH-FILL-02 Filling Line'],
    status: 'Active',
  },
  {
    id: 'emp-03',
    employeeId: 'EMP-2026-003',
    nik: '3275011804950002',
    fullName: 'Dewi Rahmawati, S.Farm., Apt.',
    gender: 'Female',
    birthDate: '1995-04-18',
    religion: 'Islam',
    maritalStatus: 'Single',
    email: 'dewi.r@cosmomanufacture.co.id',
    phone: '0813-8899-0011',
    department: 'Quality Control',
    position: 'QC Microbiology Supervisor',
    jobGrade: 'G3 Supervisor',
    managerName: 'Quality Director',
    employmentStatus: 'Permanent',
    hireDate: '2023-01-10',
    bpjsKesehatanNo: '000201920194',
    bpjsKetenagakerjaanNo: '23010192019',
    npwpNo: '77.291.882.3-412.000',
    bankAccountNo: '11800991201',
    bankName: 'Bank Mandiri',
    basicSalaryIdr: 14500000,
    positionAllowanceIdr: 2500000,
    transportAllowanceIdr: 1000000,
    mealAllowanceIdr: 850000,
    machineQualificationCertificates: ['LAB-MICRO-01 Incubation System', 'CPKB ISO 22716 Auditor'],
    status: 'Active',
  },
  {
    id: 'emp-04',
    employeeId: 'EMP-2026-004',
    nik: '3275010101980005',
    fullName: 'Budi Kurniawan, A.Md.T.',
    gender: 'Male',
    birthDate: '1998-01-01',
    religion: 'Kristen',
    maritalStatus: 'Single',
    email: 'budi.k@cosmomanufacture.co.id',
    phone: '0811-2233-4455',
    department: 'Maintenance',
    position: 'HVAC Cleanroom Maintenance Technician',
    jobGrade: 'G2 Senior Tech',
    managerName: 'Bambang S. (Maint Manager)',
    employmentStatus: 'Contract',
    hireDate: '2024-02-01',
    bpjsKesehatanNo: '000210920195',
    bpjsKetenagakerjaanNo: '24010920195',
    npwpNo: '66.192.883.4-412.000',
    bankAccountNo: '8830912099',
    bankName: 'Bank BCA',
    basicSalaryIdr: 8200000,
    positionAllowanceIdr: 800000,
    transportAllowanceIdr: 750000,
    mealAllowanceIdr: 750000,
    machineQualificationCertificates: ['HVAC-CLEANROOM-01 Class 10k', 'EAM CMMS Specialist'],
    status: 'Active',
  },
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-01',
    employeeId: 'EMP-2026-002',
    employeeName: 'Rian Hidayat, S.ST.',
    department: 'Factory Production',
    date: '2026-08-07',
    shiftName: 'Shift 1 (07:00 - 15:00)',
    checkInTime: '06:52:10',
    checkOutTime: '15:05:40',
    checkInStatus: 'On Time',
    checkInMethod: 'Face Recognition',
    locationGps: '-6.2891, 107.1512 (Cleanroom Gate 1)',
    cleanroomGateVerified: true,
  },
  {
    id: 'att-02',
    employeeId: 'EMP-2026-003',
    employeeName: 'Dewi Rahmawati, S.Farm., Apt.',
    department: 'Quality Control',
    date: '2026-08-07',
    shiftName: 'Office (08:00 - 17:00)',
    checkInTime: '07:55:00',
    checkOutTime: '17:10:15',
    checkInStatus: 'On Time',
    checkInMethod: 'GPS Mobile ESS',
    locationGps: '-6.2890, 107.1510 (HQ Lab Building)',
    cleanroomGateVerified: true,
  },
  {
    id: 'att-03',
    employeeId: 'EMP-2026-004',
    employeeName: 'Budi Kurniawan, A.Md.T.',
    department: 'Maintenance',
    date: '2026-08-07',
    shiftName: 'Shift 1 (07:00 - 15:00)',
    checkInTime: '07:12:30',
    checkOutTime: '15:30:00',
    checkInStatus: 'Late Check-in',
    checkInMethod: 'Fingerprint',
    locationGps: '-6.2892, 107.1515 (Maintenance Bay)',
    cleanroomGateVerified: false,
  },
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv-01',
    leaveCode: 'LV-2026-0801',
    employeeId: 'EMP-2026-001',
    employeeName: 'Dr. Hendra Wijaya, M.Si.',
    department: 'R&D Formula Lab',
    leaveType: 'Annual Leave',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    totalDays: 3,
    reason: 'Cuti Tahunan Keluarga & Seminar Kosmetika Internasional',
    approvalStatus: 'Approved',
    approvedBy: 'Direktur Utama',
  },
];

export const initialOvertimeRequests: OvertimeRequest[] = [
  {
    id: 'ot-01',
    otCode: 'OT-2026-0801',
    employeeId: 'EMP-2026-002',
    employeeName: 'Rian Hidayat, S.ST.',
    department: 'Factory Production',
    date: '2026-08-05',
    hours: 3.5,
    reason: 'Lembur Batch Urgent Sunscreen Cream (Overtime Homogenizer Tank)',
    overtimeMultiplier: 1.5,
    calculatedOtPayIdr: 288461, // 3.5 * (BasicSalary / 173) * 1.5
    approvalStatus: 'Approved',
    approvedBy: 'Agus Santoso (Prod SPV)',
  },
];

export const initialPayrollPeriod: PayrollTransaction[] = [
  {
    id: 'pay-01',
    payrollPeriod: '2026-08',
    employeeId: 'EMP-2026-001',
    employeeName: 'Dr. Hendra Wijaya, M.Si.',
    department: 'R&D Formula Lab',
    position: 'R&D Formulation Manager',
    basicSalaryIdr: 28000000,
    allowancesTotalIdr: 7500000,
    overtimePayIdr: 0,
    grossSalaryIdr: 35500000,
    bpjsKesehatanDeductionIdr: 280000, // max cap
    bpjsKetenagakerjaanDeductionIdr: 560000,
    pph21TaxDeductionIdr: 2850000,
    otherDeductionIdr: 0,
    netTakeHomePayIdr: 31810000,
    paymentStatus: 'Processed',
    paymentDate: '2026-08-25',
  },
  {
    id: 'pay-02',
    payrollPeriod: '2026-08',
    employeeId: 'EMP-2026-002',
    employeeName: 'Rian Hidayat, S.ST.',
    department: 'Factory Production',
    position: 'Senior MES Homogenizer Operator',
    basicSalaryIdr: 9500000,
    allowancesTotalIdr: 2750000,
    overtimePayIdr: 850000,
    grossSalaryIdr: 13100000,
    bpjsKesehatanDeductionIdr: 95000,
    bpjsKetenagakerjaanDeductionIdr: 190000,
    pph21TaxDeductionIdr: 420000,
    otherDeductionIdr: 0,
    netTakeHomePayIdr: 12395000,
    paymentStatus: 'Processed',
    paymentDate: '2026-08-25',
  },
];

export const initialTrainingPrograms: TrainingProgram[] = [
  {
    id: 'tr-01',
    trainingCode: 'TRN-CPKB-2026',
    title: 'Penerapan Sanitasi Cleanroom & CPKB ISO 22716 Versi Terbaru 2026',
    category: 'CPKB Cleanroom ISO 22716',
    instructor: 'Ir. Budi Santoso (BPOM Certified Consultant)',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    enrolledCount: 24,
    status: 'Upcoming',
  },
  {
    id: 'tr-02',
    trainingCode: 'TRN-FORM-2026',
    title: 'Teknologi Emulsifikasi Vacuum Homogenizer & Stability Testing Serum',
    category: 'Chemical Safety & Formulation',
    instructor: 'Dr. Hendra Wijaya, M.Si.',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    enrolledCount: 12,
    status: 'Completed',
  },
];

export const initialPerformanceKpis: PerformanceKpi[] = [
  {
    id: 'kpi-01',
    employeeId: 'EMP-2026-002',
    employeeName: 'Rian Hidayat, S.ST.',
    period: '2026-Q2',
    kpiTitle: 'Tingkat Yield Mixing Homogenizer Tank & Zero Batch Failure',
    targetMetric: 'Yield >= 97.5% & Failure = 0',
    actualAchieved: 'Yield 98.8% & Failure 0 Batch',
    scorePct: 105,
    evaluationGrade: 'A - Outstanding',
    evaluatorName: 'Agus Santoso (Prod SPV)',
  },
  {
    id: 'kpi-02',
    employeeId: 'EMP-2026-003',
    employeeName: 'Dewi Rahmawati, S.Farm., Apt.',
    period: '2026-Q2',
    kpiTitle: 'Kecepatan Rilis LIMS Micro Lab & Uji Tantangan Pengawet Challenge Test',
    targetMetric: 'Lead time <= 5 hari kerja',
    actualAchieved: 'Lead time 4.2 hari kerja',
    scorePct: 100,
    evaluationGrade: 'B - Meets Expectation',
    evaluatorName: 'Quality Director',
  },
];
