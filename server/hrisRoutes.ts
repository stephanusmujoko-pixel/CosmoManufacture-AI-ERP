import express, { Request, Response } from 'express';
import {
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialOvertimeRequests,
  initialPayrollPeriod,
  initialTrainingPrograms,
  initialPerformanceKpis,
  initialCleanroomClearances,
  initialShiftRosters,
  initialSkillCompetencies,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  OvertimeRequest,
  PayrollTransaction,
  CleanroomClearance,
  ShiftRoster,
  SkillCompetency,
} from './hrisData.js';

export const hrisRouter = express.Router();

// In-memory state
let employeesList = [...initialEmployees];
let attendanceList = [...initialAttendance];
let leaveRequests = [...initialLeaveRequests];
let overtimeRequests = [...initialOvertimeRequests];
let payrollList = [...initialPayrollPeriod];
let trainingList = [...initialTrainingPrograms];
let kpiList = [...initialPerformanceKpis];
let cleanroomClearancesList = [...initialCleanroomClearances];
let shiftRostersList = [...initialShiftRosters];
let skillCompetenciesList = [...initialSkillCompetencies];

// ==========================================
// 1. EMPLOYEES MASTER API
// ==========================================
hrisRouter.get('/employees', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: employeesList.length,
    data: employeesList,
  });
});

hrisRouter.post('/employees', (req: Request, res: Response) => {
  const { fullName, nik, email, phone, department, position, jobGrade, basicSalaryIdr } = req.body;

  if (!fullName || !department || !position) {
    return res.status(400).json({ error: 'Nama Lengkap, Departemen, dan Jabatan wajib diisi.' });
  }

  const newEmp: Employee = {
    id: `emp-${Date.now()}`,
    employeeId: `EMP-2026-${String(employeesList.length + 1).padStart(3, '0')}`,
    nik: nik || '3275000000000000',
    fullName,
    gender: req.body.gender || 'Male',
    birthDate: req.body.birthDate || '1995-01-01',
    religion: req.body.religion || 'Islam',
    maritalStatus: req.body.maritalStatus || 'Single',
    email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@cosmomanufacture.co.id`,
    phone: phone || '0812-0000-0000',
    department,
    position,
    jobGrade: jobGrade || 'G1 Operator',
    managerName: req.body.managerName || 'Plant Manager',
    employmentStatus: req.body.employmentStatus || 'Permanent',
    hireDate: new Date().toISOString().substring(0, 10),
    bpjsKesehatanNo: '000' + Math.floor(Math.random() * 1000000000),
    bpjsKetenagakerjaanNo: '210' + Math.floor(Math.random() * 1000000000),
    npwpNo: '88.000.000.0-412.000',
    bankAccountNo: '88309' + Math.floor(Math.random() * 100000),
    bankName: 'Bank BCA',
    basicSalaryIdr: Number(basicSalaryIdr || 8500000),
    positionAllowanceIdr: Number(req.body.positionAllowanceIdr || 1000000),
    transportAllowanceIdr: 750000,
    mealAllowanceIdr: 750000,
    machineQualificationCertificates: req.body.machineQualificationCertificates || ['CPKB Cleanroom Basic'],
    status: 'Active',
  };

  employeesList.unshift(newEmp);
  res.status(201).json({ success: true, message: 'Karyawan baru berhasil ditambahkan.', data: newEmp });
});

// ==========================================
// 2. ATTENDANCE & CHECK-IN API
// ==========================================
hrisRouter.get('/attendance', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: attendanceList.length,
    data: attendanceList,
  });
});

hrisRouter.post('/attendance/checkin', (req: Request, res: Response) => {
  const { employeeId, method, shiftName, locationGps } = req.body;

  const emp = employeesList.find((e) => e.id === employeeId || e.employeeId === employeeId);
  if (!emp) {
    return res.status(404).json({ error: 'Karyawan tidak ditemukan.' });
  }

  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 8);
  const isLate = timeStr > '08:00:00' && shiftName?.includes('Office');

  const newAtt: AttendanceRecord = {
    id: `att-${Date.now()}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    department: emp.department,
    date: now.toISOString().substring(0, 10),
    shiftName: shiftName || 'Office (08:00 - 17:00)',
    checkInTime: timeStr,
    checkOutTime: '-',
    checkInStatus: isLate ? 'Late Check-in' : 'On Time',
    checkInMethod: method || 'GPS Mobile ESS',
    locationGps: locationGps || '-6.2891, 107.1512 (HQ Cleanroom Gate)',
    cleanroomGateVerified: true,
  };

  attendanceList.unshift(newAtt);
  res.status(201).json({ success: true, message: `Absensi ${emp.fullName} berhasil dicatat (${newAtt.checkInStatus}).`, data: newAtt });
});

// ==========================================
// 3. LEAVE & OVERTIME API
// ==========================================
hrisRouter.get('/leaves', (req: Request, res: Response) => {
  res.json({ success: true, data: leaveRequests });
});

hrisRouter.post('/leaves', (req: Request, res: Response) => {
  const { employeeId, leaveType, startDate, endDate, totalDays, reason } = req.body;
  const emp = employeesList.find((e) => e.id === employeeId || e.employeeId === employeeId);

  const newLeave: LeaveRequest = {
    id: `lv-${Date.now()}`,
    leaveCode: `LV-2026-${String(leaveRequests.length + 1).padStart(3, '0')}`,
    employeeId: emp?.employeeId || 'EMP-2026-001',
    employeeName: emp?.fullName || 'Karyawan',
    department: emp?.department || 'Production',
    leaveType: leaveType || 'Annual Leave',
    startDate: startDate || new Date().toISOString().substring(0, 10),
    endDate: endDate || new Date().toISOString().substring(0, 10),
    totalDays: Number(totalDays || 1),
    reason: reason || 'Keperluan Pribadi',
    approvalStatus: 'Pending Approval',
    approvedBy: emp?.managerName || 'Manager',
  };

  leaveRequests.unshift(newLeave);
  res.status(201).json({ success: true, message: 'Pengajuan Cuti berhasil diajukan ke atasan.', data: newLeave });
});

hrisRouter.get('/overtime', (req: Request, res: Response) => {
  res.json({ success: true, data: overtimeRequests });
});

hrisRouter.post('/overtime', (req: Request, res: Response) => {
  const { employeeId, hours, reason } = req.body;
  const emp = employeesList.find((e) => e.id === employeeId || e.employeeId === employeeId) || employeesList[1];

  const otPay = Math.round(Number(hours || 2) * (emp.basicSalaryIdr / 173) * 1.5);

  const newOt: OvertimeRequest = {
    id: `ot-${Date.now()}`,
    otCode: `OT-2026-${String(overtimeRequests.length + 1).padStart(3, '0')}`,
    employeeId: emp.employeeId,
    employeeName: emp.fullName,
    department: emp.department,
    date: new Date().toISOString().substring(0, 10),
    hours: Number(hours || 2),
    reason: reason || 'Lembur Operasional Batch Produksi Urgent',
    overtimeMultiplier: 1.5,
    calculatedOtPayIdr: otPay,
    approvalStatus: 'Approved',
    approvedBy: emp.managerName,
  };

  overtimeRequests.unshift(newOt);
  res.status(201).json({ success: true, message: 'Surat Perintah Lembur (SPL) berhasil disetujui.', data: newOt });
});

// ==========================================
// 4. PAYROLL ENGINE API
// ==========================================
hrisRouter.get('/payroll', (req: Request, res: Response) => {
  res.json({
    success: true,
    period: '2026-08',
    count: payrollList.length,
    data: payrollList,
  });
});

hrisRouter.post('/payroll/run', (req: Request, res: Response) => {
  const { period } = req.body;

  const generatedPayroll = employeesList.map((emp) => {
    const totAllowances = emp.positionAllowanceIdr + emp.transportAllowanceIdr + emp.mealAllowanceIdr;
    
    // Find overtime
    const empOt = overtimeRequests.filter((o) => o.employeeId === emp.employeeId && o.approvalStatus === 'Approved');
    const otPay = empOt.reduce((a, c) => a + c.calculatedOtPayIdr, 0);

    const gross = emp.basicSalaryIdr + totAllowances + otPay;
    const bpjsKes = Math.min(12000000, emp.basicSalaryIdr) * 0.01; // 1% employee cap
    const bpjsTk = emp.basicSalaryIdr * 0.02; // 2% JHT
    const pph21 = Math.round(gross * 0.05); // TER PPh 21 estimation
    const thp = gross - (bpjsKes + bpjsTk + pph21);

    return {
      id: `pay-${emp.id}-${Date.now()}`,
      payrollPeriod: period || '2026-08',
      employeeId: emp.employeeId,
      employeeName: emp.fullName,
      department: emp.department,
      position: emp.position,
      basicSalaryIdr: emp.basicSalaryIdr,
      allowancesTotalIdr: totAllowances,
      overtimePayIdr: otPay,
      grossSalaryIdr: gross,
      bpjsKesehatanDeductionIdr: Math.round(bpjsKes),
      bpjsKetenagakerjaanDeductionIdr: Math.round(bpjsTk),
      pph21TaxDeductionIdr: pph21,
      otherDeductionIdr: 0,
      netTakeHomePayIdr: Math.round(thp),
      paymentStatus: 'Processed' as 'Processed',
      paymentDate: '2026-08-25',
    };
  });

  payrollList = generatedPayroll;

  res.json({
    success: true,
    message: `Payroll Engine sukses menghitung gaji ${payrollList.length} karyawan untuk periode ${period || '2026-08'}.`,
    totalPayrollThpIdr: payrollList.reduce((a, c) => a + c.netTakeHomePayIdr, 0),
    data: payrollList,
  });
});

// ==========================================
// 5. TRAINING & COMPETENCY API
// ==========================================
hrisRouter.get('/training', (req: Request, res: Response) => {
  res.json({ success: true, data: trainingList });
});

hrisRouter.get('/performance', (req: Request, res: Response) => {
  res.json({ success: true, data: kpiList });
});

// ==========================================
// 6. CLEANROOM CLEARANCE & GOWNING API
// ==========================================
hrisRouter.get('/cleanroom/clearance', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: cleanroomClearancesList.length,
    data: cleanroomClearancesList,
  });
});

hrisRouter.post('/cleanroom/clearance', (req: Request, res: Response) => {
  const { employeeId, cleanroomGradeAccess, gowningScorePct, medicalStatus } = req.body;
  const emp = employeesList.find((e) => e.employeeId === employeeId || e.id === employeeId);

  const newClr: CleanroomClearance = {
    id: `clr-${Date.now()}`,
    employeeId: emp?.employeeId || 'EMP-2026-002',
    employeeName: emp?.fullName || 'Operator Cleanroom',
    department: emp?.department || 'Factory Production',
    cleanroomGradeAccess: cleanroomGradeAccess || 'Grade B (Aseptic Mixing)',
    gowningCompetencyScorePct: Number(gowningScorePct || 98),
    medicalClearanceStatus: medicalStatus || 'Cleared (Fit for Cleanroom)',
    lastSwabTestDate: new Date().toISOString().substring(0, 10),
    swabTestResult: 'Negative (Pass)',
    hygieneAuditScorePct: 100,
    airShowerGateAccessGranted: true,
    clearanceExpiryDate: '2027-02-08',
  };

  cleanroomClearancesList.unshift(newClr);
  res.status(201).json({
    success: true,
    message: `Sertifikasi Cleanroom & Gowning untuk ${newClr.employeeName} berhasil disetujui.`,
    data: newClr,
  });
});

// ==========================================
// 7. SHIFT ROSTER & LINE ALLOCATION API
// ==========================================
hrisRouter.get('/roster', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: shiftRostersList.length,
    data: shiftRostersList,
  });
});

hrisRouter.post('/roster', (req: Request, res: Response) => {
  const { date, shiftName, lineLocation, lineLeader, cleanroomGrade } = req.body;

  const newRoster: ShiftRoster = {
    id: `rst-${Date.now()}`,
    date: date || new Date().toISOString().substring(0, 10),
    shiftName: shiftName || 'Shift 1 (07:00 - 15:00)',
    lineLocation: lineLocation || 'Cleanroom Line 1 Mixing',
    lineLeader: lineLeader || 'Agus Santoso (Prod SPV)',
    assignedStaffCount: 4,
    cleanroomGrade: cleanroomGrade || 'Grade B',
    assignedOperators: [
      {
        employeeId: 'EMP-2026-002',
        employeeName: 'Rian Hidayat, S.ST.',
        position: 'Senior Operator',
        machineQualification: 'MCH-MIX-01 Homogenizer',
      },
    ],
  };

  shiftRostersList.unshift(newRoster);
  res.status(201).json({
    success: true,
    message: `Shift Roster untuk ${newRoster.lineLocation} berhasil dibuat.`,
    data: newRoster,
  });
});

// ==========================================
// 8. SKILL MATRIX & COMPETENCY DIRECTORY API
// ==========================================
hrisRouter.get('/skill-matrix', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: skillCompetenciesList.length,
    data: skillCompetenciesList,
  });
});

// ==========================================
// 9. AI HR ASSISTANT & MANPOWER PREDICTOR
// ==========================================
hrisRouter.post('/ai-hr/predict', (req: Request, res: Response) => {
  const { targetLine, upcomingBatchCount } = req.body;

  const reqBatch = Number(upcomingBatchCount || 5);
  const calculatedOperatorNeeded = Math.ceil(reqBatch * 1.5);
  const currentAvailableOperators = 8;
  const gap = currentAvailableOperators - calculatedOperatorNeeded;

  res.json({
    success: true,
    analysis: {
      targetLine: targetLine || 'Cleanroom Mixing Line 1',
      plannedBatches: reqBatch,
      recommendedStaffCount: calculatedOperatorNeeded,
      availableCertifiedStaff: currentAvailableOperators,
      manpowerStatus: gap >= 0 ? 'Sufficient Certified Staff' : 'Shortage Warning (Overtime Recommended)',
      recommendedOvertimeHours: gap < 0 ? Math.abs(gap) * 4 : 0,
      cpkbComplianceCheck: '100% Medical Checkup & Gowning Certified',
      turnoverRiskPercent: 4.2,
      trainingRecommendation: 'Sertifikasi Tambahan untuk Operator Cadangan Homogenizer 1000L',
    },
  });
});

export default hrisRouter;
