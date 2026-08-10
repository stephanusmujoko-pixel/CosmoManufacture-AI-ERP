import React, { useState, useEffect } from 'react';
import {
  Users,
  CalendarCheck,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
  Briefcase,
  FileText,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Building,
  ShieldCheck,
  Check,
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  BarChart2,
  Calendar,
  FileCheck,
  Stethoscope,
  Activity,
  Cpu,
  UserCheck,
  Flame,
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  nik: string;
  fullName: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  religion: string;
  maritalStatus: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  jobGrade: string;
  managerName: string;
  employmentStatus: string;
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
  machineQualificationCertificates: string[];
  status: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  shiftName: string;
  checkInTime: string;
  checkOutTime: string;
  checkInStatus: string;
  checkInMethod: string;
  locationGps: string;
  cleanroomGateVerified: boolean;
}

interface LeaveRequest {
  id: string;
  leaveCode: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  approvalStatus: string;
  approvedBy: string;
}

interface OvertimeRequest {
  id: string;
  otCode: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  hours: number;
  reason: string;
  overtimeMultiplier: number;
  calculatedOtPayIdr: number;
  approvalStatus: string;
  approvedBy: string;
}

interface PayrollTransaction {
  id: string;
  payrollPeriod: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  basicSalaryIdr: number;
  allowancesTotalIdr: number;
  overtimePayIdr: number;
  grossSalaryIdr: number;
  bpjsKesehatanDeductionIdr: number;
  bpjsKetenagakerjaanDeductionIdr: number;
  pph21TaxDeductionIdr: number;
  otherDeductionIdr: number;
  netTakeHomePayIdr: number;
  paymentStatus: string;
  paymentDate: string;
}

interface TrainingProgram {
  id: string;
  trainingCode: string;
  title: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  enrolledCount: number;
  status: string;
}

interface PerformanceKpi {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  kpiTitle: string;
  targetMetric: string;
  actualAchieved: string;
  scorePct: number;
  evaluationGrade: string;
  evaluatorName: string;
}

interface CleanroomClearance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  cleanroomGradeAccess: string;
  gowningCompetencyScorePct: number;
  medicalClearanceStatus: string;
  lastSwabTestDate: string;
  swabTestResult: string;
  hygieneAuditScorePct: number;
  airShowerGateAccessGranted: boolean;
  clearanceExpiryDate: string;
}

interface ShiftRoster {
  id: string;
  date: string;
  shiftName: string;
  lineLocation: string;
  lineLeader: string;
  assignedStaffCount: number;
  cleanroomGrade: string;
  assignedOperators: Array<{
    employeeId: string;
    employeeName: string;
    position: string;
    machineQualification: string;
  }>;
}

interface SkillCompetency {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  skills: Array<{
    machineOrProcess: string;
    qualificationLevel: string;
    certifiedDate: string;
    certExpiryDate: string;
  }>;
}

export const HrisExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'cleanroom_clearance'
    | 'shift_roster'
    | 'employees'
    | 'attendance'
    | 'leave_ot'
    | 'payroll'
    | 'skill_matrix'
    | 'training'
    | 'performance'
    | 'ess_mss'
    | 'ai_hr'
  >('dashboard');

  const tabsRef = React.useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [overtimes, setOvertimes] = useState<OvertimeRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollTransaction[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [kpis, setKpis] = useState<PerformanceKpi[]>([]);
  const [cleanroomClearances, setCleanroomClearances] = useState<CleanroomClearance[]>([]);
  const [shiftRosters, setShiftRosters] = useState<ShiftRoster[]>([]);
  const [skillCompetencies, setSkillCompetencies] = useState<SkillCompetency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters & Selected Modal items
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddClearanceModal, setShowAddClearanceModal] = useState(false);
  const [showAddRosterModal, setShowAddRosterModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollTransaction | null>(null);

  // Forms
  const [newEmpForm, setNewEmpForm] = useState({
    fullName: '',
    nik: '',
    email: '',
    phone: '',
    department: 'Factory Production',
    position: 'Operator Filling & Packaging',
    jobGrade: 'G1 Operator',
    basicSalaryIdr: 7500000,
    positionAllowanceIdr: 800000,
  });

  const [newClrForm, setNewClrForm] = useState({
    employeeId: '',
    cleanroomGradeAccess: 'Grade B (Aseptic Mixing)',
    gowningScorePct: 98,
    medicalStatus: 'Cleared (Fit for Cleanroom)',
  });

  const [newRosterForm, setNewRosterForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    shiftName: 'Shift 1 (07:00 - 15:00)',
    lineLocation: 'Cleanroom Processing Line 1 (Mixing & Filling)',
    lineLeader: 'Agus Santoso (Prod SPV)',
    cleanroomGrade: 'Grade B & C',
  });

  // AI Predictor state
  const [aiTargetLine, setAiTargetLine] = useState('Cleanroom Mixing Line 1');
  const [aiBatchCount, setAiBatchCount] = useState(6);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [checkInMethod, setCheckInMethod] = useState<'Face Recognition' | 'GPS Mobile ESS' | 'Fingerprint'>('Face Recognition');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchHrisData = async () => {
    setIsLoading(true);
    try {
      const [empRes, attRes, lvRes, otRes, payRes, trRes, kpiRes, clrRes, rstRes, skRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/attendance'),
        fetch('/api/leaves'),
        fetch('/api/overtime'),
        fetch('/api/payroll'),
        fetch('/api/training'),
        fetch('/api/performance'),
        fetch('/api/cleanroom/clearance'),
        fetch('/api/roster'),
        fetch('/api/skill-matrix'),
      ]);

      if (empRes.ok) setEmployees((await empRes.json()).data || []);
      if (attRes.ok) setAttendance((await attRes.json()).data || []);
      if (lvRes.ok) setLeaves((await lvRes.json()).data || []);
      if (otRes.ok) setOvertimes((await otRes.json()).data || []);
      if (payRes.ok) setPayroll((await payRes.json()).data || []);
      if (trRes.ok) setTrainings((await trRes.json()).data || []);
      if (kpiRes.ok) setKpis((await kpiRes.json()).data || []);
      if (clrRes.ok) setCleanroomClearances((await clrRes.json()).data || []);
      if (rstRes.ok) setShiftRosters((await rstRes.json()).data || []);
      if (skRes.ok) setSkillCompetencies((await skRes.json()).data || []);
    } catch (err) {
      console.error('Failed to fetch HRIS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHrisData();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmpForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Karyawan ${data.data.fullName} (${data.data.employeeId}) berhasil didaftarkan.`);
        setShowAddEmployeeModal(false);
        fetchHrisData();
      } else {
        showToast(data.error || 'Gagal menambahkan karyawan.');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  const handleSimulateCheckIn = async (employeeId: string) => {
    try {
      const res = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          method: checkInMethod,
          shiftName: 'Shift 1 (07:00 - 15:00)',
          locationGps: '-6.2891, 107.1512 (Cleanroom Gate Alpha)',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        fetchHrisData();
      }
    } catch (err) {
      showToast('Gagal memproses presensi.');
    }
  };

  const handleRunPayroll = async () => {
    try {
      const res = await fetch('/api/payroll/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: '2026-08' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Payroll Engine Sukses! Total THP: Rp ${data.totalPayrollThpIdr.toLocaleString('id-ID')}`);
        fetchHrisData();
      }
    } catch (err) {
      showToast('Gagal memproses kalkulasi payroll.');
    }
  };

  const handleCreateClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cleanroom/clearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClrForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setShowAddClearanceModal(false);
        fetchHrisData();
      } else {
        showToast('Gagal menerbitkan sertifikasi cleanroom.');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi.');
    }
  };

  const handleCreateRoster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRosterForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setShowAddRosterModal(false);
        fetchHrisData();
      } else {
        showToast('Gagal membuat shift roster.');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi.');
    }
  };

  const handleRunAiPrediction = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-hr/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLine: aiTargetLine,
          upcomingBatchCount: aiBatchCount,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiAnalysisResult(data.analysis);
        showToast('Analisis AI Manpower & CPKB Selesai!');
      }
    } catch (err) {
      showToast('Gagal menjalankan simulasi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((e) => {
    const matchSearch = e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || e.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 lg:p-8 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-800 via-slate-800/80 to-purple-950/40 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 text-white">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">HRIS, Payroll & Talent Management</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CPKB & ISO 22716
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Sistem SDM Terintegrasi Industri Kosmetik • Mobile ESS/MSS • Automatic BPJS & PPh21 • Operator Qualification Matrix
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddClearanceModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs transition shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Clearance Cleanroom</span>
          </button>
          <button
            onClick={() => setShowAddRosterModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Roster</span>
          </button>
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-xs transition shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Staff</span>
          </button>
          <button
            onClick={fetchHrisData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Container with Interactive Scroll Arrows */}
      <div className="relative flex items-center gap-1.5 mb-6 pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="flex-shrink-0 p-2.5 bg-slate-800 hover:bg-purple-600/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-md transition-all z-10"
          title="Geser Menu ke Kiri"
          aria-label="Geser Menu ke Kiri"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={tabsRef}
          onWheel={(e) => {
            if (e.deltaY !== 0 && tabsRef.current) {
              tabsRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth touch-pan-x custom-scrollbar flex-1 scrollbar-none"
        >
          {[
            { id: 'dashboard', label: 'HR Dashboard', icon: BarChart2 },
            { id: 'cleanroom_clearance', label: 'Cleanroom & Gowning', icon: ShieldCheck },
            { id: 'shift_roster', label: 'Shift Roster & Line', icon: Calendar },
            { id: 'employees', label: 'Employee Master', icon: Users },
            { id: 'attendance', label: 'Attendance & Gate', icon: CalendarCheck },
            { id: 'leave_ot', label: 'Cuti & Lembur (SPL)', icon: Clock },
            { id: 'payroll', label: 'Payroll Engine', icon: DollarSign },
            { id: 'skill_matrix', label: 'Skill Matrix Mesin', icon: Cpu },
            { id: 'training', label: 'Training CPKB', icon: Award },
            { id: 'performance', label: 'KPI Talent', icon: TrendingUp },
            { id: 'ess_mss', label: 'ESS / MSS Portal', icon: Briefcase },
            { id: 'ai_hr', label: 'AI HR Analytics', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold ring-1 ring-purple-400/50'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="flex-shrink-0 p-2.5 bg-slate-800 hover:bg-purple-600/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-md transition-all z-10"
          title="Geser Menu ke Kanan"
          aria-label="Geser Menu ke Kanan"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN TAB CONTENT */}
      {activeTab === 'dashboard' && (
        <div className="space-[#space] space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Karyawan</span>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">{employees.length}</div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">100% Active</span> • Multi-Shift Factory
              </div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Presensi Hari Ini</span>
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-emerald-400">98.2%</div>
              <div className="text-xs text-slate-400 mt-2">
                {attendance.length} Terdeteksi (Face / GPS Cleanroom Gate)
              </div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Anggaran Payroll Bln Ini</span>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                Rp {payroll.reduce((a, c) => a + c.netTakeHomePayIdr, 0).toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-400 mt-2">Termasuk BPJS + PPh21 TER</div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Kualifikasi Mesin CPKB</span>
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400">94.5%</div>
              <div className="text-xs text-slate-400 mt-2">Operator Bersertifikasi Homogenizer/LIMS</div>
            </div>
          </div>

          {/* AI HR Insight Widget & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 via-slate-800 to-slate-800 p-6 rounded-2xl border border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
                <h2 className="text-lg font-bold text-white">AI HR Predictive Insight</h2>
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30 font-mono">
                  Live Analytics
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-700/60 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-purple-200">Rekomendasi Penjadwalan Shift Produksi</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Kebutuhan batch Sunscreen Cream minggu depan membutuhkan 2 operator homogenizer bersertifikasi khusus (Rian Hidayat). Disarankan menugaskan Rian pada Shift 1 untuk mencegah bottleneck mixing tank.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-700/60 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-200">Analisis Turnover & Kepuasan Karyawan</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Turnover rate departemen R&D & QC sebesar 0% dalam 12 bulan terakhir. Skor kepuasan kerja dan pemenuhan KPI triwulanan mencapai rata-rata 101%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-4">Tindakan Cepat SDM</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 flex items-center justify-between transition text-sm font-medium text-slate-200"
                  >
                    <span>Absensi Face Recognition / GPS</span>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('leave_ot')}
                    className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 flex items-center justify-between transition text-sm font-medium text-slate-200"
                  >
                    <span>Persetujuan Lembur (SPL) Urgent</span>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={handleRunPayroll}
                    className="w-full text-left px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl flex items-center justify-between transition text-sm font-medium text-purple-200"
                  >
                    <span>Hitung Gaji Periode 2026-08</span>
                    <DollarSign className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                <span>Integrasi MES & Finance:</span>
                <span className="text-emerald-400 font-semibold">Tersinkronisasi</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CLEANROOM & GOWNING CLEARANCE */}
      {activeTab === 'cleanroom_clearance' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Cleanroom Gowning & Medical Clearance (CPKB / GMP)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Verifikasi kelayakan medis (swab test), kompetensi gowning steril, dan hak akses Air Shower Gate untuk Operator Cleanroom Grade A/B/C/D.
              </p>
            </div>

            <button
              onClick={() => setShowAddClearanceModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Sertifikasi Clearance Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cleanroomClearances.map((clr) => (
              <div key={clr.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    {clr.cleanroomGradeAccess}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{clr.id}</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{clr.employeeName}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{clr.employeeId} • {clr.department}</div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Skor Gowning Steril:</span>
                    <strong className="text-emerald-400 font-mono text-sm">{clr.gowningCompetencyScorePct}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status Clearance Medis:</span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                      {clr.medicalClearanceStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Hasil Swab Test Kulit/Kuku:</span>
                    <span className="text-slate-200 font-medium">{clr.swabTestResult} ({clr.lastSwabTestDate})</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Air Shower Access Gate:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Masa Berlaku Clearance:</span>
                  <span className="font-mono text-purple-300 font-semibold">{clr.clearanceExpiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SHIFT ROSTER & LINE ALLOCATION */}
      {activeTab === 'shift_roster' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span>Shift Roster & Cleanroom Line Staff Allocation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Penjadwalan Shift 1, 2, 3 dan alokasi operator bersertifikasi khusus ke lini produksi cleanroom MES.
              </p>
            </div>

            <button
              onClick={() => setShowAddRosterModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Roster Shift Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {shiftRosters.map((rst) => (
              <div key={rst.id} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-xs font-mono text-purple-400 font-bold">{rst.id}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{rst.lineLocation}</h3>
                    <div className="text-xs text-slate-400">
                      Tingkat Cleanroom: <strong className="text-purple-300">{rst.cleanroomGrade}</strong> • Leader: <strong className="text-slate-200">{rst.lineLeader}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-full text-xs font-bold">
                      {rst.shiftName}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Tanggal: <strong className="text-white">{rst.date}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator Bertugas di Lini Ini:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rst.assignedOperators.map((op, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-sm">{op.employeeName}</div>
                          <div className="text-xs text-slate-400">{op.position}</div>
                        </div>
                        <span className="px-2 py-0.5 text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                          {op.machineQualification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE MASTER */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari NIK / Nama karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 text-sm text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                <option value="All">Semua Departemen</option>
                <option value="Factory Production">Factory Production</option>
                <option value="R&D Formula Lab">R&D Formula Lab</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Karyawan & NIK</th>
                    <th className="px-6 py-4">Departemen & Posisi</th>
                    <th className="px-6 py-4">Grade & Status</th>
                    <th className="px-6 py-4">Sertifikasi Mesin CPKB</th>
                    <th className="px-6 py-4">Gaji Pokok</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{emp.fullName}</div>
                        <div className="text-xs font-mono text-purple-400 mt-0.5">{emp.employeeId} • NIK: {emp.nik}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-200 font-medium">{emp.position}</div>
                        <div className="text-xs text-slate-400">{emp.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700 text-purple-300 border border-slate-600">
                          {emp.jobGrade}
                        </span>
                        <div className="text-xs text-emerald-400 font-medium mt-1">{emp.employmentStatus}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {emp.machineQualificationCertificates.map((cert, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[11px] rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-100">
                        Rp {emp.basicSalaryIdr.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30 transition flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE & SHIFT ROSTER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-400" />
              <span>Simulator Presensi Karyawan (Cleanroom Gate GPS & Face Recognition)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Metode Presensi</label>
                <select
                  value={checkInMethod}
                  onChange={(e) => setCheckInMethod(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Face Recognition">Face Recognition AI Gate</option>
                  <option value="GPS Mobile ESS">GPS Mobile ESS (Geofencing Factory)</option>
                  <option value="Fingerprint">Fingerprint Biometric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Pilih Karyawan untuk Check-in</label>
                <select
                  onChange={(e) => e.target.value && handleSimulateCheckIn(e.target.value)}
                  className="w-full bg-purple-600/30 border border-purple-500/40 text-purple-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>-- Klik Karyawan untuk Check-In --</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.employeeId}>
                      {e.fullName} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center text-xs text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mr-2" />
                <span>Seluruh presensi disinkronkan otomatis ke modul Payroll dan Produksi MES.</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Log Presensi Real-Time</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Tanggal & Shift</th>
                    <th className="px-4 py-3">Karyawan</th>
                    <th className="px-4 py-3">Check In</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Metode & Lokasi</th>
                    <th className="px-4 py-3">Cleanroom Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{att.date}</div>
                        <div className="text-xs text-slate-400">{att.shiftName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{att.employeeName}</div>
                        <div className="text-xs text-purple-400">{att.department}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">{att.checkInTime}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            att.checkInStatus === 'On Time'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {att.checkInStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">
                        <div>{att.checkInMethod}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{att.locationGps}</div>
                      </td>
                      <td className="px-4 py-3">
                        {att.cleanroomGateVerified ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            <Check className="w-3.5 h-3.5" /> Terverifikasi
                          </span>
                        ) : (
                          <span className="text-xs text-amber-400">Non-Cleanroom</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE & OVERTIME (SPL) */}
      {activeTab === 'leave_ot' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cuti (Leave) */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Pengajuan & Persetujuan Cuti</span>
              </h2>
            </div>

            <div className="space-y-3">
              {leaves.map((lv) => (
                <div key={lv.id} className="p-4 bg-slate-900/70 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{lv.leaveCode}</span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {lv.approvalStatus}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{lv.employeeName} ({lv.department})</h4>
                  <div className="text-xs text-slate-300 mt-1">
                    Jenis: <span className="text-purple-300 font-medium">{lv.leaveType}</span> • {lv.totalDays} Hari ({lv.startDate} s/d {lv.endDate})
                  </div>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-800 p-2 rounded-lg italic">"{lv.reason}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lembur (Overtime / SPL) */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Surat Perintah Lembur (SPL)</span>
              </h2>
            </div>

            <div className="space-y-3">
              {overtimes.map((ot) => (
                <div key={ot.id} className="p-4 bg-slate-900/70 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">{ot.otCode}</span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {ot.approvalStatus}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{ot.employeeName}</h4>
                  <div className="text-xs text-slate-300 mt-1">
                    Durasi: <span className="text-amber-300 font-bold">{ot.hours} Jam</span> (Multiplier {ot.overtimeMultiplier}x)
                  </div>
                  <div className="text-xs text-emerald-400 font-mono font-bold mt-1">
                    Nilai Upah Lembur: Rp {ot.calculatedOtPayIdr.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-800 p-2 rounded-lg italic">"{ot.reason}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PAYROLL ENGINE */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <span>Automatic Payroll Engine (BPJS + PPh 21 TER)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Perhitungan gaji otomatis terhubung dengan Presensi, Lembur, Potongan BPJS Kesehatan 1%, BPJS TK 2%, dan TER PPh21.
              </p>
            </div>

            <button
              onClick={handleRunPayroll}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jalankan Payroll Periode 2026-08</span>
            </button>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Karyawan</th>
                    <th className="px-6 py-4">Gaji Pokok & Tunjangan</th>
                    <th className="px-6 py-4">Lembur</th>
                    <th className="px-6 py-4">Potongan BPJS & PPh21</th>
                    <th className="px-6 py-4">Take Home Pay (THP)</th>
                    <th className="px-6 py-4 text-right">Payslip PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{pay.employeeName}</div>
                        <div className="text-xs text-slate-400">{pay.position}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-200">Gaji: Rp {pay.basicSalaryIdr.toLocaleString('id-ID')}</div>
                        <div className="text-xs text-purple-300">Tunjangan: Rp {pay.allowancesTotalIdr.toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-amber-400 font-semibold">
                        Rp {pay.overtimePayIdr.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-red-300">
                        <div>BPJS Kes: -Rp {pay.bpjsKesehatanDeductionIdr.toLocaleString('id-ID')}</div>
                        <div>BPJS TK: -Rp {pay.bpjsKetenagakerjaanDeductionIdr.toLocaleString('id-ID')}</div>
                        <div>PPh21: -Rp {pay.pph21TaxDeductionIdr.toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-lg font-bold text-emerald-400">
                        Rp {pay.netTakeHomePayIdr.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedPayslip(pay)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium border border-slate-600 transition flex items-center gap-1.5 ml-auto"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          <span>Cetak Slip Gaji</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SKILL MATRIX */}
      {activeTab === 'skill_matrix' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-400" />
              <span>Matriks Kompetensi Operator Mesin & CPKB</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Kualifikasi teknis operator pada mesin produksi utama (Vacuum Homogenizer, Filling Tube, HPLC Lab, Incubator).
            </p>

            <div className="space-y-4">
              {skillCompetencies.map((sk) => (
                <div key={sk.id} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="font-bold text-white text-base">{sk.employeeName}</h3>
                      <div className="text-xs text-slate-400 font-mono">{sk.employeeId} • {sk.department}</div>
                    </div>
                    <span className="text-xs font-mono text-purple-400 font-bold">{sk.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sk.skills.map((s, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1">
                        <div className="text-xs font-bold text-slate-200">{s.machineOrProcess}</div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-800">
                            {s.qualificationLevel}
                          </span>
                          <span className="text-slate-400 font-mono">Exp: {s.certExpiryDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRAINING & COMPETENCY */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Program Pelatihan & Sertifikasi CPKB Cleanroom ISO 22716</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainings.map((tr) => (
                <div key={tr.id} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">{tr.trainingCode}</span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        tr.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}
                    >
                      {tr.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{tr.title}</h3>
                  <div className="text-xs text-slate-300">
                    Kategori: <span className="text-purple-300 font-medium">{tr.category}</span>
                  </div>
                  <div className="text-xs text-slate-400">Instruktur: {tr.instructor}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-300">
                    <span>Peserta: <strong className="text-white">{tr.enrolledCount} Karyawan</strong></span>
                    <span>Jadwal: {tr.startDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PERFORMANCE & KPI */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>Penilaian Kinerja (KPI & OKR Management)</span>
            </h2>

            <div className="space-y-3">
              {kpis.map((k) => (
                <div key={k.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{k.employeeName}</h4>
                      <span className="px-2 py-0.5 text-xs rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {k.period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 font-medium">{k.kpiTitle}</p>
                    <div className="text-xs text-slate-400 mt-1">
                      Target: {k.targetMetric} • Capaian: <strong className="text-emerald-400">{k.actualAchieved}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-700 pt-3 md:pt-0 md:pl-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-purple-300">{k.scorePct}%</div>
                      <div className="text-xs text-emerald-400 font-semibold">{k.evaluationGrade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ESS / MSS */}
      {activeTab === 'ess_mss' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <span>Employee Self Service (ESS) Portal</span>
            </h2>
            <p className="text-xs text-slate-400">
              Karyawan dapat mengajukan Cuti, Lembur (SPL), klaim reimbursement, serta mengunduh Slip Gaji & SPT PPh 21 dari ponsel atau web.
            </p>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-2 text-sm text-slate-300">
              <div className="font-semibold text-purple-300">Status Absensi Hari Ini:</div>
              <div className="text-emerald-400 font-mono">✓ Check-in 06:52 WIB (Gate 1 Cleanroom)</div>
              <div className="pt-2 text-xs text-slate-400">Sisa Cuti Tahunan 2026: <strong>9 Hari</strong></div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Manager Self Service (MSS) Portal</span>
            </h2>
            <p className="text-xs text-slate-400">
              Manager dapat menyetujui pengajuan Cuti, Lembur, evaluasi KPI tim, dan memantau kualifikasi operator produksi secara langsung.
            </p>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-2 text-sm text-slate-300">
              <div className="font-semibold text-emerald-300">Pending Approvals:</div>
              <div className="text-xs text-slate-300">• 0 Pengajuan Cuti Menunggu</div>
              <div className="text-xs text-slate-300">• 1 Pengajuan Lembur Disetujui</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: AI HR ASSISTANT */}
      {activeTab === 'ai_hr' && (
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-purple-500/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
            <Bot className="w-8 h-8 text-purple-400 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold text-white">AI HR Assistant & Predictive Manpower Analytics</h2>
              <p className="text-xs text-slate-400">
                Simulasi Otomatis Kebutuhan Tenaga Kerja Cleanroom, skill gap operator, dan rekomendasi lembur berdasarkan jadwal MES.
              </p>
            </div>
          </div>

          {/* Interactive AI Simulation Form */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-purple-500/30 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Simulasi AI Kebutuhan Operator MES & Cleanroom</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Lini Produksi MES</label>
                <select
                  value={aiTargetLine}
                  onChange={(e) => setAiTargetLine(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Cleanroom Processing Line 1 (Mixing & Filling)">Cleanroom Line 1 (Mixing & Filling)</option>
                  <option value="Cleanroom Packaging Line 2 (Tube & Box)">Cleanroom Line 2 (Packaging)</option>
                  <option value="R&D Pilot Plant Formula Lab">R&D Pilot Plant Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rencana Batch Minggu Depan</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={aiBatchCount}
                  onChange={(e) => setAiBatchCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunAiPrediction}
                  disabled={isAiLoading}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
                >
                  <Bot className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? 'Menganalisis...' : 'Jalankan Simulasi AI'}</span>
                </button>
              </div>
            </div>

            {aiAnalysisResult && (
              <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-2 text-xs text-purple-100 animate-fadeIn">
                <div className="font-bold text-sm text-purple-200 flex items-center justify-between">
                  <span>Hasil Analisis AI: {aiAnalysisResult.targetLine}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                    {aiAnalysisResult.manpowerStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-purple-500/30">
                  <div>Rencana Batch: <strong className="text-white">{aiAnalysisResult.plannedBatches} Batch</strong></div>
                  <div>Rekomendasi Operator: <strong className="text-emerald-300">{aiAnalysisResult.recommendedStaffCount} Orang</strong></div>
                  <div>Tersedia Certified: <strong className="text-purple-300">{aiAnalysisResult.availableCertifiedStaff} Orang</strong></div>
                  <div>CPKB Compliance: <strong className="text-emerald-300">{aiAnalysisResult.cpkbComplianceCheck}</strong></div>
                </div>
                <div className="pt-2 text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                  💡 <strong>Rekomendasi Pelatihan AI:</strong> {aiAnalysisResult.trainingRecommendation}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Prediksi Turnover Karyawan</span>
              </h4>
              <p className="text-xs text-slate-300">
                Risiko turnover keseluruhan sangat rendah (0.8%). Retensi tenaga ahli formulasi dan supervisor QC terjaga berkat jenjang karir dan fasilitas tunjangan yang kompetitif.
              </p>
            </div>

            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Skill Gap & Sertifikasi Mesin CPKB</span>
              </h4>
              <p className="text-xs text-slate-300">
                94.5% operator telah terverifikasi Kualifikasi Mesin Homogenizer dan Line Filling Sesuai Pedoman CPKB BPOM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMPLOYEE */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white">Pendaftaran Karyawan Baru</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.fullName}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, fullName: e.target.value })}
                  placeholder="Contoh: Anita Permata, S.Si."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Departemen</label>
                  <select
                    value={newEmpForm.department}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="Factory Production">Factory Production</option>
                    <option value="R&D Formula Lab">R&D Formula Lab</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="PPIC & Warehouse">PPIC & Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Posisi Jabatan</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.position}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, position: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    value={newEmpForm.basicSalaryIdr}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, basicSalaryIdr: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tunjangan Jabatan (Rp)</label>
                  <input
                    type="number"
                    value={newEmpForm.positionAllowanceIdr}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, positionAllowanceIdr: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYSLIP PREVIEW */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>SLIP GAJI RESMI — {selectedPayslip.payrollPeriod}</span>
              </h3>
              <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3 font-mono text-xs text-slate-200">
              <div className="text-center pb-2 border-b border-slate-800">
                <div className="font-bold text-sm text-white uppercase">PT PARAGONIA COSMETIC INDUSTRI</div>
                <div className="text-slate-400 text-[11px]">Cikarang Factory • ISO 22716 Certified</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Nama: <strong className="text-white">{selectedPayslip.employeeName}</strong></div>
                <div>NIP: <strong className="text-purple-300">{selectedPayslip.employeeId}</strong></div>
                <div>Jabatan: {selectedPayslip.position}</div>
                <div>Dept: {selectedPayslip.department}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between"><span>Gaji Pokok:</span><span>Rp {selectedPayslip.basicSalaryIdr.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Tunjangan:</span><span>Rp {selectedPayslip.allowancesTotalIdr.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Lembur (SPL):</span><span>Rp {selectedPayslip.overtimePayIdr.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-red-300"><span>BPJS Kesehatan (1%):</span><span>-Rp {selectedPayslip.bpjsKesehatanDeductionIdr.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-red-300"><span>BPJS TK JHT (2%):</span><span>-Rp {selectedPayslip.bpjsKetenagakerjaanDeductionIdr.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-red-300"><span>PPh 21 TER:</span><span>-Rp {selectedPayslip.pph21TaxDeductionIdr.toLocaleString('id-ID')}</span></div>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-slate-700 flex justify-between text-sm font-bold text-emerald-400">
                <span>TAKE HOME PAY (THP):</span>
                <span>Rp {selectedPayslip.netTakeHomePayIdr.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('Memunculkan pratinjau cetak PDF Slip Gaji...');
                  setSelectedPayslip(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Slip Gaji PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EMPLOYEE PROFILE DETAIL */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Profil Karyawan - {selectedEmployee.fullName}</span>
              </h3>
              <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <div>NIP: <strong className="text-purple-300 font-mono">{selectedEmployee.employeeId}</strong> • NIK: {selectedEmployee.nik}</div>
                <div>Departemen: <strong className="text-white">{selectedEmployee.department}</strong></div>
                <div>Posisi: <strong className="text-white">{selectedEmployee.position}</strong> ({selectedEmployee.jobGrade})</div>
                <div>Status Kerja: <span className="text-emerald-400">{selectedEmployee.employmentStatus}</span> • Tgl Masuk: {selectedEmployee.hireDate}</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <div className="font-semibold text-slate-200">Legal & Rekening:</div>
                <div>BPJS Kesehatan: <span className="font-mono text-slate-300">{selectedEmployee.bpjsKesehatanNo}</span></div>
                <div>BPJS Ketenagakerjaan: <span className="font-mono text-slate-300">{selectedEmployee.bpjsKetenagakerjaanNo}</span></div>
                <div>NPWP: <span className="font-mono text-slate-300">{selectedEmployee.npwpNo}</span></div>
                <div>Bank: <span className="font-mono text-slate-300">{selectedEmployee.bankName} - {selectedEmployee.bankAccountNo}</span></div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLEANROOM CLEARANCE */}
      {showAddClearanceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Terbitkan Clearance Cleanroom Baru</span>
              </h3>
              <button onClick={() => setShowAddClearanceModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClearance} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pilih Karyawan</label>
                <select
                  required
                  value={newClrForm.employeeId}
                  onChange={(e) => setNewClrForm({ ...newClrForm, employeeId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Pilih Operator / Staff --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.fullName} ({emp.employeeId} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Akses Kelas Cleanroom (Grade Access)</label>
                <select
                  value={newClrForm.cleanroomGradeAccess}
                  onChange={(e) => setNewClrForm({ ...newClrForm, cleanroomGradeAccess: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Grade A/B (Aseptic Filling & Mixing)">Grade A/B (Aseptic Filling & Mixing)</option>
                  <option value="Grade B (Aseptic Processing)">Grade B (Aseptic Processing)</option>
                  <option value="Grade C (Bulk Formulation)">Grade C (Bulk Formulation)</option>
                  <option value="Grade D (Secondary Packaging)">Grade D (Secondary Packaging)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Skor Ujian Gowning (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newClrForm.gowningScorePct}
                    onChange={(e) => setNewClrForm({ ...newClrForm, gowningScorePct: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Kesehatan Medis</label>
                  <input
                    type="text"
                    value={newClrForm.medicalStatus}
                    onChange={(e) => setNewClrForm({ ...newClrForm, medicalStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddClearanceModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Terbitkan Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SHIFT ROSTER */}
      {showAddRosterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Buat Jadwal Roster Shift Baru</span>
              </h3>
              <button onClick={() => setShowAddRosterModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoster} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tanggal Roster</label>
                  <input
                    type="date"
                    required
                    value={newRosterForm.date}
                    onChange={(e) => setNewRosterForm({ ...newRosterForm, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Shift Kerja</label>
                  <select
                    value={newRosterForm.shiftName}
                    onChange={(e) => setNewRosterForm({ ...newRosterForm, shiftName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="Shift 1 (07:00 - 15:00)">Shift 1 (07:00 - 15:00)</option>
                    <option value="Shift 2 (15:00 - 23:00)">Shift 2 (15:00 - 23:00)</option>
                    <option value="Shift 3 (23:00 - 07:00)">Shift 3 (23:00 - 07:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lokasi Lini Produksi MES</label>
                <input
                  type="text"
                  required
                  value={newRosterForm.lineLocation}
                  onChange={(e) => setNewRosterForm({ ...newRosterForm, lineLocation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Supervisor / Line Leader</label>
                <input
                  type="text"
                  required
                  value={newRosterForm.lineLeader}
                  onChange={(e) => setNewRosterForm({ ...newRosterForm, lineLeader: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddRosterModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Simpan Jadwal Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrisExplorer;
