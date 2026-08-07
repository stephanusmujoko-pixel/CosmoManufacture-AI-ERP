import express, { Request, Response } from 'express';
import {
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialOvertimeRequests,
  initialPayrollPeriod,
  initialTrainingPrograms,
  initialPerformanceKpis,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  OvertimeRequest,
  PayrollTransaction,
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

export default hrisRouter;
