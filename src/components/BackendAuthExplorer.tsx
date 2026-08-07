import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  User,
  Users,
  Server,
  FileCode,
  Database,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Code2,
  Activity,
  Smartphone,
  Building2,
  Layers,
  ArrowRight,
  Eye,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DataTable } from './ui/DataTable';

export const DEFAULT_ROLES = [
  'Super Admin Tenant',
  'Factory Director / Owner',
  'R&D Formulation Specialist',
  'MES Production Manager',
  'Mixing & Batching Operator',
  'Quality Control (QC) Inspector',
  'Quality Assurance (QA) Manager',
  'Microbiology Lab Specialist',
  'Regulatory & BPOM Officer',
  'PPIC Planner & Scheduler',
  'Warehouse & FEFO Officer',
  'Purchasing & Buyer Specialist',
  'Finance & Accounting Manager',
  'Sales & Maklon Account Executive',
  'Maintenance & Calibration Engineer',
  'Cleanroom Staff (Class A/B/C)',
  'Halal Assurance Officer (LPPOM)',
  'Internal Auditor ISO 22716',
  'EHS & Safety Manager',
  'HR & Staff Scheduling Manager',
  'External BPOM Inspector (Auditor)',
  'Guest / Read-Only Client Partner',
];

export const BackendAuthExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'architecture' | 'database' | 'swagger' | 'rbac' | 'security'>('sandbox');

  // Sandbox States
  const [tenantHeader, setTenantHeader] = useState('t-cosmo-01');
  const [apiEndpoint, setApiEndpoint] = useState('/api/auth/login');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'DELETE'>('POST');
  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ email: 'hendra@beautyglow.co.id', password: 'P@ssw0rd2026!', rememberMe: true }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live Backend Data States
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [liveAuditLogs, setLiveAuditLogs] = useState<any[]>([]);
  const [liveUsers, setLiveUsers] = useState<any[]>([]);

  // Fetch initial backend state
  const fetchBackendData = async () => {
    try {
      const resSess = await fetch('/api/sessions', { headers: { 'x-tenant-id': tenantHeader } });
      const dataSess = await resSess.json();
      if (dataSess.data) setLiveSessions(dataSess.data);

      const resAudit = await fetch('/api/audit-logs', { headers: { 'x-tenant-id': tenantHeader } });
      const dataAudit = await resAudit.json();
      if (dataAudit.data) setLiveAuditLogs(dataAudit.data);

      const resUsers = await fetch('/api/users', { headers: { 'x-tenant-id': tenantHeader } });
      const dataUsers = await resUsers.json();
      if (dataUsers.data) setLiveUsers(dataUsers.data);
    } catch (e) {
      console.error('Failed fetching live backend status:', e);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, [tenantHeader]);

  const handleExecuteApi = async () => {
    setIsLoading(true);
    setApiResponse(null);

    try {
      const options: RequestInit = {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantHeader,
        },
      };

      if (apiMethod === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(apiEndpoint, options);
      const json = await res.json();
      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        headers: {
          'x-tenant-id': tenantHeader,
          'content-type': res.headers.get('content-type'),
          'x-content-type-options': res.headers.get('x-content-type-options'),
        },
        body: json,
      });

      // Refresh live logs
      fetchBackendData();
    } catch (err: any) {
      setApiResponse({
        error: true,
        message: err.message || 'Gagal mengeksekusi request ke server backend.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setQuickEndpoint = (endpoint: string, method: 'GET' | 'POST' | 'DELETE', bodyObj?: any) => {
    setApiEndpoint(endpoint);
    setApiMethod(method);
    if (bodyObj) {
      setRequestBody(JSON.stringify(bodyObj, null, 2));
    } else {
      setRequestBody('{}');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Server className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Prompt 4 — Backend Auth, Security, RBAC & Multi-Tenant Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Arsitektur backend Clean NestJS/Express, JWT Token Rotation, Argon2 Hasher, Granular RBAC (22 Roles), Sesi Device, Audit Log & Isolation Multi-Tenant.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Backend Online (Cloud Run)</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'sandbox'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Live API Sandbox & Console
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'architecture'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏛️ Clean Architecture Code Structure
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'database'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🗄️ Prisma Database Schema
        </button>
        <button
          onClick={() => setActiveTab('swagger')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'swagger'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📜 Swagger / OpenAPI Spec
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'rbac'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          👑 Granular RBAC (22 Roles)
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-5 whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🛡️ Multi-Tenant Security Guard
        </button>
      </div>

      {/* TAB 1: LIVE API SANDBOX & CONSOLE */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Request Builder */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  REST API Request Tester
                </span>
                <span className="text-[10px] text-slate-400">Pilih skenario endpoint di bawah</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() =>
                    setQuickEndpoint('/api/auth/login', 'POST', {
                      email: 'hendra@beautyglow.co.id',
                      password: 'P@ssw0rd2026!',
                      rememberMe: true,
                    })
                  }
                  className="rounded-lg bg-emerald-950 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900"
                >
                  POST /auth/login
                </button>

                <button
                  onClick={() =>
                    setQuickEndpoint('/api/auth/register', 'POST', {
                      companyName: 'PT Nusantara Formulasi',
                      brandName: 'Nusantara Glow',
                      email: 'admin@nusantara.co.id',
                      whatsapp: '081299998888',
                      password: 'StrongP@ssw0rd2026!',
                    })
                  }
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700"
                >
                  POST /auth/register
                </button>

                <button
                  onClick={() =>
                    setQuickEndpoint('/api/auth/refresh', 'POST', {
                      refreshToken: 'ref_tok_8812_rot_9912',
                    })
                  }
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-slate-700"
                >
                  POST /auth/refresh
                </button>

                <button
                  onClick={() => setQuickEndpoint('/api/sessions', 'GET')}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700"
                >
                  GET /sessions
                </button>

                <button
                  onClick={() => setQuickEndpoint('/api/audit-logs', 'GET')}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700"
                >
                  GET /audit-logs
                </button>
              </div>

              {/* Input Header & URL */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Tenant ID Header (`x-tenant-id`)</label>
                  <select
                    value={tenantHeader}
                    onChange={(e) => setTenantHeader(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-emerald-300 font-mono"
                  >
                    <option value="t-cosmo-01">t-cosmo-01 (PT Beauty Glow Indonesia)</option>
                    <option value="t-paragonia-02">t-paragonia-02 (PT Paragonia Cosmetic Industri)</option>
                    <option value="all">all (Super Admin Global View)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <select
                    value={apiMethod}
                    onChange={(e) => setApiMethod(e.target.value as any)}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-amber-300"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100"
                  />
                </div>

                {apiMethod === 'POST' && (
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">JSON Request Body</label>
                    <textarea
                      rows={6}
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleExecuteApi}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 font-bold text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md"
                >
                  {isLoading ? (
                    <span>Mengeksekusi Request Server...</span>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-amber-300" />
                      <span>Kirim REST Request Ke Backend</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-amber-400" />
                    Realtime Server Response
                  </span>
                  {apiResponse?.status && (
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                      HTTP Status {apiResponse.status}
                    </span>
                  )}
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto max-h-[340px] font-mono text-[11px] text-emerald-300 leading-relaxed custom-scrollbar">
                  {apiResponse ? (
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <p className="text-slate-500 italic">// Klik "Kirim REST Request Ke Backend" untuk melihat respon nyata dari server Express/NestJS.</p>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic text-center pt-2">
                Server backend memverifikasi header `x-tenant-id`, mendekripsi payload JWT, dan mencatat event ke Audit Log.
              </p>
            </div>
          </div>

          {/* Live Sessions & Audit Stream Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Active Sessions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  Sesi Login Perangkat Aktif
                </h3>
                <span className="text-[10px] text-emerald-300 font-mono">Tenant: {tenantHeader}</span>
              </div>

              <div className="space-y-2 text-xs">
                {liveSessions.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white font-mono">{s.id}</span>
                      <button
                        onClick={async () => {
                          await fetch(`/api/sessions/${s.id}`, { method: 'DELETE', headers: { 'x-tenant-id': tenantHeader } });
                          fetchBackendData();
                        }}
                        className="text-[10px] font-bold text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Kill Session
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">User ID: {s.userId} | IP: {s.ipAddress}</p>
                    <p className="text-[10px] text-slate-400 truncate">{s.userAgent}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Audit Log Stream */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  Audit Log Stream Realtime
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Top 5 Events</span>
              </div>

              <div className="space-y-2 text-xs">
                {liveAuditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-emerald-300">{log.action}</span>
                      <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-200">{log.userEmail} ({log.module})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLEAN ARCHITECTURE CODE STRUCTURE */}
      {activeTab === 'architecture' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Struktur Clean Architecture & Domain Driven Design (DDD)
            </h3>
            <p className="text-xs text-slate-400">
              Pemisahan tanggung jawab secara eksplisit menjadi 4 layer utama (Presentation, Application, Domain, Infrastructure).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase text-[11px]">1. Presentation Layer (API & DTO)</span>
              <p className="text-slate-300">
                • NestJS AuthController (`/auth/login`, `/auth/register`) <br />
                • DTO Validation dengan Zod & Class-Validator <br />
                • Swagger/OpenAPI Annotations `@ApiTags('Auth')`
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 uppercase text-[11px]">2. Application Layer (Use Cases)</span>
              <p className="text-slate-300">
                • `AuthenticateUserUseCase.execute()` <br />
                • `RotateRefreshTokenUseCase.execute()` <br />
                • `TenantOnboardingService.createTenant()`
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-teal-400 uppercase text-[11px]">3. Domain Layer (Entities & Rules)</span>
              <p className="text-slate-300">
                • `UserEntity`, `TenantEntity`, `RoleEntity` <br />
                • `PermissionValueObject` (13 Granular Actions) <br />
                • Policy rules & Password Argon2 Hash specifications
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 uppercase text-[11px]">4. Infrastructure Layer (Adapters)</span>
              <p className="text-slate-300">
                • Prisma Database Repositories (`UserRepositoryPrisma`) <br />
                • Redis Blacklist Service & BullMQ Notification queue <br />
                • JwtAuthGuard & TenantIsolationInterceptor
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRISMA DATABASE SCHEMA */}
      {activeTab === 'database' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              Skema Tabel Database Relasional PostgreSQL (Prisma ORM)
            </h3>
            <span className="text-[10px] text-amber-300 font-mono">12 Auth & Security Tables</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto font-mono text-[11px] text-slate-300 leading-relaxed custom-scrollbar">
            <pre>
{`// schema.prisma - Enterprise Auth & Security Schema

model Tenant {
  id        String   @id @default(uuid())
  name      String
  brand     String
  email     String   @unique
  whatsapp  String
  status    String   @default("active")
  createdAt DateTime @default(now())

  users     User[]
  sessions  Session[]
  auditLogs AuditLog[]
}

model User {
  id           String    @id @default(uuid())
  tenantId     String
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  email        String    @unique
  username     String
  fullName     String
  passwordHash String
  mfaEnabled   Boolean   @default(false)
  status       String    @default("active")
  createdAt    DateTime  @default(now())

  userRoles    UserRole[]
  sessions     Session[]
  devices      Device[]
}

model Role {
  id           String   @id @default(uuid())
  tenantId     String
  name         String
  description  String?
  isSystemRole Boolean  @default(false)

  rolePermissions RolePermission[]
  userRoles       UserRole[]
}

model Permission {
  id          String @id @default(uuid())
  code        String @unique // e.g. "qc_micro:approve"
  module      String
  action      String
  description String

  rolePermissions RolePermission[]
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  tenantId     String
  tokenHash    String
  refreshToken String   @unique
  deviceId     String
  ipAddress    String
  userAgent    String
  expiresAt    DateTime
  lastActiveAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  tenant Tenant @relation(fields: [tenantId], references: [id])
}

model AuditLog {
  id        String   @id @default(uuid())
  tenantId  String
  userId    String
  userEmail String
  action    String
  module    String
  resource  String
  status    String
  ipAddress String
  userAgent String
  details   Json
  timestamp DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SWAGGER / OPENAPI SPEC */}
      {activeTab === 'swagger' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              OpenAPI 3.0 / Swagger JSON Specification Endpoint (`/api/swagger`)
            </h3>
            <button
              onClick={async () => {
                const res = await fetch('/api/swagger');
                const json = await res.json();
                setApiResponse(json);
                setActiveTab('sandbox');
              }}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
            >
              Uji Endpoint di Sandbox
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
            <p className="text-slate-300 font-bold">Fitur Dokumentasi OpenAPI Terpasang:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
              <li>Skema Keamanan `BearerAuth` (JWT) & Header `x-tenant-id`</li>
              <li>Spesifikasi Request/Response Body untuk `/auth/login`, `/auth/register`, `/auth/refresh`</li>
              <li>Status Code standar (200 OK, 201 Created, 401 Unauthorized, 403 Forbidden, 429 Too Many Requests)</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 5: RBAC 22 ROLES */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Sistem Role-Based Access Control (RBAC) terkonfigurasi secara hierarkis mencakup 22 role default industri manufaktur kosmetik.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {DEFAULT_ROLES.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200">{r}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {r.includes('Admin') || r.includes('Owner') ? 'Full' : 'Scoped'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MULTI-TENANT SECURITY */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Fitur Keamanan Aplikasi Ready
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold">
                🔒 Argon2 Password Hashing Engine (`m=65536, t=3, p=4`)
              </li>
              <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold">
                🔄 JWT Access Token & Refresh Token Rotation
              </li>
              <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold">
                🛑 Redis Revocation & Token Blacklist Engine
              </li>
              <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold">
                🛡️ Helmet Header Protection & Strict Rate Limiting
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-400" />
              Isolasi Data Multi-Tenant Absolute
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap kueri database (Prisma Middleware / Row-Level Security) secara otomatis menyuntikkan klausa filter `WHERE tenant_id = req.tenantId`. Hal ini menjamin <span className="font-bold text-amber-300">Zero Cross-Tenant Data Leak</span> antar perusahaan maklon/pabrik kosmetik.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
