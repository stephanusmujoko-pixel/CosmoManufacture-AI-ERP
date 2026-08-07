export interface Tenant {
  id: string;
  name: string;
  brand: string;
  email: string;
  whatsapp: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  username: string;
  fullName: string;
  passwordHash: string; // Argon2 hashed
  mfaEnabled: boolean;
  mfaSecret?: string;
  status: 'active' | 'unverified' | 'locked';
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  code: string;
  module: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'export' | 'import' | 'print' | 'manage' | 'assign' | 'configure' | 'audit';
  description: string;
}

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  tokenHash: string;
  refreshToken: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  isTrusted: boolean;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isTrusted: boolean;
  lastActiveAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  resource: string;
  status: 'success' | 'failure' | 'unauthorized';
  ipAddress: string;
  userAgent: string;
  details: any;
  timestamp: string;
}

// Default 22 System Roles
export const DEFAULT_ROLES = [
  'Super Admin SaaS',
  'Tenant Owner',
  'CEO',
  'Director',
  'General Manager',
  'Production Manager',
  'Production Supervisor',
  'Operator Produksi',
  'QC Manager',
  'QC Staff',
  'R&D Manager',
  'PPIC',
  'Warehouse Manager',
  'Warehouse Staff',
  'Purchasing',
  'Finance Manager',
  'Accounting',
  'HR Manager',
  'Sales Manager',
  'Marketing',
  'Auditor',
  'Guest',
];

// Initial In-Memory Store
export const dbTenants: Tenant[] = [
  {
    id: 't-cosmo-01',
    name: 'PT Beauty Glow Indonesia',
    brand: 'AuraGlow Skincare',
    email: 'admin@beautyglow.co.id',
    whatsapp: '081234567890',
    status: 'active',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 't-paragonia-02',
    name: 'PT Paragonia Cosmetic Industri',
    brand: 'Luminance Skincare',
    email: 'admin@paragonia.co.id',
    whatsapp: '081987654321',
    status: 'active',
    createdAt: '2026-08-02T11:00:00Z',
  },
];

export const dbUsers: User[] = [
  {
    id: 'u-dev-00',
    tenantId: 't-cosmo-01',
    email: 'stephanusmujoko@gmail.com',
    username: 'stephanus_dev',
    fullName: 'Stephanus Mujoko (Lead Developer & Super Admin)',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dev123456',
    mfaEnabled: false,
    status: 'active',
    roles: ['Super Admin SaaS', 'Tenant Owner', 'Lead Developer'],
    createdAt: '2026-08-01T00:00:00Z',
    lastLoginAt: '2026-08-07T04:55:00Z',
  },
  {
    id: 'u-admin-01',
    tenantId: 't-cosmo-01',
    email: 'hendra@beautyglow.co.id',
    username: 'hendra_admin',
    fullName: 'Hendra Wijaya, S.T.',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$hashedpassword_hendra',
    mfaEnabled: true,
    status: 'active',
    roles: ['Tenant Owner', 'Super Admin SaaS'],
    createdAt: '2026-08-01T10:05:00Z',
    lastLoginAt: '2026-08-06T16:00:00Z',
  },
  {
    id: 'u-apj-02',
    tenantId: 't-cosmo-01',
    email: 'maya@beautyglow.co.id',
    username: 'apt_maya',
    fullName: 'Apt. Maya Indah, S.Farm',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$hashedpassword_maya',
    mfaEnabled: true,
    status: 'active',
    roles: ['QC Manager', 'R&D Manager'],
    createdAt: '2026-08-01T10:10:00Z',
    lastLoginAt: '2026-08-06T15:30:00Z',
  },
];

export const dbSessions: Session[] = [
  {
    id: 'sess-8812',
    userId: 'u-admin-01',
    tenantId: 't-cosmo-01',
    tokenHash: 'jwt_access_token_hash_8812',
    refreshToken: 'ref_tok_8812_rot_9912',
    deviceId: 'dev-mac-01',
    ipAddress: '180.252.20.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/127.0.0.0',
    isTrusted: true,
    createdAt: '2026-08-06T16:00:00Z',
    expiresAt: '2026-08-07T00:00:00Z',
    lastActiveAt: '2026-08-06T17:00:00Z',
  },
];

export const dbDevices: Device[] = [
  {
    id: 'dev-mac-01',
    userId: 'u-admin-01',
    deviceName: 'MacBook Pro M3 (Pabrik Cleanroom 1)',
    deviceType: 'desktop',
    browser: 'Chrome 127.0',
    os: 'macOS Sonoma',
    ipAddress: '180.252.20.12',
    location: 'Jakarta, Indonesia',
    isTrusted: true,
    lastActiveAt: '2026-08-06T17:00:00Z',
  },
  {
    id: 'dev-ios-02',
    userId: 'u-apj-02',
    deviceName: 'iPhone 15 Pro (Apoteker APJ Mobile)',
    deviceType: 'mobile',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17.5',
    ipAddress: '180.252.20.18',
    location: 'Bekasi, Indonesia',
    isTrusted: true,
    lastActiveAt: '2026-08-06T15:30:00Z',
  },
];

export const dbAuditLogs: AuditLog[] = [
  {
    id: 'aud-1001',
    tenantId: 't-cosmo-01',
    userId: 'u-admin-01',
    userEmail: 'hendra@beautyglow.co.id',
    action: 'AUTH_LOGIN_SUCCESS',
    module: 'Authentication',
    resource: '/api/auth/login',
    status: 'success',
    ipAddress: '180.252.20.12',
    userAgent: 'Chrome 127.0 macOS',
    details: { mfaVerified: true, sessionCreated: 'sess-8812' },
    timestamp: '2026-08-06T16:00:00Z',
  },
  {
    id: 'aud-1002',
    tenantId: 't-cosmo-01',
    userId: 'u-apj-02',
    userEmail: 'maya@beautyglow.co.id',
    action: 'PERM_APPROVE_COA',
    module: 'Quality Control',
    resource: '/api/qc/coa/COA-2026-0801/approve',
    status: 'success',
    ipAddress: '180.252.20.18',
    userAgent: 'Safari Mobile iOS',
    details: { coaNumber: 'COA-2026-0801', eBpomNa: 'NA18240199882' },
    timestamp: '2026-08-06T15:35:00Z',
  },
];
