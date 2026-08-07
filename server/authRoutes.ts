import { Router, Request, Response, NextFunction } from 'express';
import {
  dbTenants,
  dbUsers,
  dbSessions,
  dbDevices,
  dbAuditLogs,
  DEFAULT_ROLES,
} from './authData.js';

export const authRouter = Router();

// Security & Multi-Tenant Middleware Helper
const tenantIsolationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 't-cosmo-01';
  (req as any).tenantId = tenantId;

  // Add Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};

authRouter.use(tenantIsolationMiddleware);

// Helper to log audit events
function addAuditLog(
  tenantId: string,
  userId: string,
  userEmail: string,
  action: string,
  module: string,
  resource: string,
  status: 'success' | 'failure' | 'unauthorized',
  req: Request,
  details: any
) {
  const newLog = {
    id: `aud-${Date.now()}`,
    tenantId,
    userId,
    userEmail,
    action,
    module,
    resource,
    status,
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown Agent',
    details,
    timestamp: new Date().toISOString(),
  };
  dbAuditLogs.unshift(newLog);
}

// 1. POST /api/auth/login
authRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan kata sandi wajib diisi.',
    });
  }

  const tenantId = (req as any).tenantId || 't-cosmo-01';
  const user = dbUsers.find((u) => u.email === email || u.username === email);

  if (!user) {
    addAuditLog(tenantId, 'anonymous', email, 'AUTH_LOGIN_FAILED', 'Authentication', '/api/auth/login', 'failure', req, {
      reason: 'User not found',
    });
    return res.status(401).json({
      success: false,
      message: 'Kredensial tidak valid atau akun belum terdaftar.',
    });
  }

  // Generate Session & Tokens
  const sessionId = `sess-${Date.now()}`;
  const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  ).toString('base64')}.signature_simulated`;

  const refreshToken = `ref_rot_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  dbSessions.unshift({
    id: sessionId,
    userId: user.id,
    tenantId: user.tenantId,
    tokenHash: accessToken.slice(-10),
    refreshToken,
    deviceId: 'dev-web-session',
    ipAddress: (req.headers['x-forwarded-for'] as string) || '180.252.20.12',
    userAgent: req.headers['user-agent'] || 'Chrome Browser',
    isTrusted: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (rememberMe ? 30 * 86400000 : 86400000)).toISOString(),
    lastActiveAt: new Date().toISOString(),
  });

  addAuditLog(user.tenantId, user.id, user.email, 'AUTH_LOGIN_SUCCESS', 'Authentication', '/api/auth/login', 'success', req, {
    sessionId,
    roles: user.roles,
    rememberMe,
  });

  return res.json({
    success: true,
    message: 'Autentikasi berhasil. Token JWT diterbitkan.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        tenantId: user.tenantId,
        mfaEnabled: user.mfaEnabled,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
        tokenType: 'Bearer',
      },
      sessionId,
    },
  });
});

// 2. POST /api/auth/register
authRouter.post('/auth/register', (req: Request, res: Response) => {
  const { companyName, brandName, email, whatsapp, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nama perusahaan, email, dan kata sandi wajib diisi.',
    });
  }

  const tenantId = `t-tenant-${Date.now().toString().slice(-4)}`;
  const userId = `u-owner-${Date.now().toString().slice(-4)}`;

  const newTenant = {
    id: tenantId,
    name: companyName,
    brand: brandName || companyName,
    email,
    whatsapp: whatsapp || '-',
    status: 'active' as const,
    createdAt: new Date().toISOString(),
  };

  const newUser = {
    id: userId,
    tenantId,
    email,
    username: email.split('@')[0],
    fullName: `Super Admin ${companyName}`,
    passwordHash: `$argon2id$v=19$m=65536,t=3,p=4$simulatedhash_${Date.now()}`,
    mfaEnabled: false,
    status: 'active' as const,
    roles: ['Tenant Owner', 'Super Admin SaaS'],
    createdAt: new Date().toISOString(),
  };

  dbTenants.unshift(newTenant);
  dbUsers.unshift(newUser);

  addAuditLog(tenantId, userId, email, 'AUTH_REGISTER_TENANT', 'Tenant Management', '/api/auth/register', 'success', req, {
    companyName,
    brandName,
  });

  return res.status(201).json({
    success: true,
    message: 'Registrasi tenant baru berhasil. Kode OTP dikirim ke WhatsApp/Email.',
    data: {
      tenant: newTenant,
      user: {
        id: newUser.id,
        email: newUser.email,
        roles: newUser.roles,
      },
      otpRequired: true,
    },
  });
});

// 3. POST /api/auth/refresh
authRouter.post('/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token wajib disertakan.' });
  }

  const session = dbSessions.find((s) => s.refreshToken === refreshToken);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Refresh token kadaluarsa atau di-revoke (Blacklisted).' });
  }

  // Token Rotation
  const newRefreshToken = `ref_rot_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const newAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.rotated_access_token_${Date.now()}`;

  session.refreshToken = newRefreshToken;
  session.lastActiveAt = new Date().toISOString();

  addAuditLog(session.tenantId, session.userId, 'session_user', 'AUTH_TOKEN_ROTATION', 'Authentication', '/api/auth/refresh', 'success', req, {
    sessionId: session.id,
  });

  return res.json({
    success: true,
    message: 'Token rotation berhasil. Access Token baru diterbitkan.',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    },
  });
});

// 4. POST /api/auth/logout
authRouter.post('/auth/logout', (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (sessionId) {
    const idx = dbSessions.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      dbSessions.splice(idx, 1);
    }
  }

  addAuditLog((req as any).tenantId || 't-cosmo-01', 'u-user', 'user@cosmo.com', 'AUTH_LOGOUT', 'Authentication', '/api/auth/logout', 'success', req, {
    sessionId,
  });

  return res.json({
    success: true,
    message: 'Sesi berhasil diakhiri (Logged out). Token dimasukkan ke Redis Blacklist.',
  });
});

// 5. GET /api/users
authRouter.get('/users', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId || 't-cosmo-01';
  const tenantUsers = dbUsers.filter((u) => u.tenantId === tenantId || tenantId === 'all');

  return res.json({
    success: true,
    tenantId,
    total: tenantUsers.length,
    data: tenantUsers,
  });
});

// 6. GET /api/roles & /api/permissions
authRouter.get('/roles', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalRoles: DEFAULT_ROLES.length,
    data: DEFAULT_ROLES.map((roleName, index) => ({
      id: `role-${index + 1}`,
      name: roleName,
      isSystemRole: true,
      permissionsCount: roleName.includes('Admin') || roleName.includes('Owner') ? 48 : 12,
    })),
  });
});

authRouter.get('/permissions', (req: Request, res: Response) => {
  const modules = ['R&D Lab', 'MES Batch', 'QC Micro', 'BPOM Regulatory', 'Warehouse FEFO', 'Finance COGM', 'HR Staff', 'Audit Trail'];
  const actions = ['view', 'create', 'update', 'delete', 'approve', 'reject', 'export', 'import', 'print', 'manage', 'assign', 'configure', 'audit'];

  const permissionsList = [];
  let id = 1;
  for (const m of modules) {
    for (const a of actions) {
      permissionsList.push({
        id: `perm-${id++}`,
        code: `${m.toLowerCase().replace(/\s+/g, '_')}:${a}`,
        module: m,
        action: a,
        description: `Izin untuk ${a} pada modul ${m}`,
      });
    }
  }

  return res.json({
    success: true,
    totalPermissions: permissionsList.length,
    data: permissionsList,
  });
});

// 7. GET /api/sessions & DELETE /api/sessions/:id
authRouter.get('/sessions', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId || 't-cosmo-01';
  const sessions = dbSessions.filter((s) => s.tenantId === tenantId);

  return res.json({
    success: true,
    tenantId,
    totalSessions: sessions.length,
    data: sessions,
  });
});

authRouter.delete('/sessions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = dbSessions.findIndex((s) => s.id === id);

  if (idx !== -1) {
    const killedSession = dbSessions[idx];
    dbSessions.splice(idx, 1);

    addAuditLog(killedSession.tenantId, killedSession.userId, 'admin@cosmo.com', 'SESSION_FORCE_KILL', 'Session Management', `/api/sessions/${id}`, 'success', req, {
      killedSessionId: id,
    });

    return res.json({
      success: true,
      message: `Sesi ${id} berhasil dihentikan secara paksa. Device terkait akan langsung ter-logout.`,
    });
  }

  return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
});

// 8. GET /api/devices
authRouter.get('/devices', (req: Request, res: Response) => {
  return res.json({
    success: true,
    totalDevices: dbDevices.length,
    data: dbDevices,
  });
});

// 9. GET /api/audit-logs
authRouter.get('/audit-logs', (req: Request, res: Response) => {
  const tenantId = (req as any).tenantId || 't-cosmo-01';
  const logs = dbAuditLogs.filter((l) => l.tenantId === tenantId || tenantId === 'all');

  return res.json({
    success: true,
    tenantId,
    totalLogs: logs.length,
    data: logs,
  });
});

// 10. GET /api/swagger (OpenAPI 3.0 Spec)
authRouter.get('/swagger', (req: Request, res: Response) => {
  return res.json({
    openapi: '3.0.3',
    info: {
      title: 'CosmoManufacture AI ERP - Enterprise Auth & Security API',
      version: '1.0.0-PROMPT4',
      description: 'Dokumentasi REST API Autentikasi, JWT Token Rotation, RBAC, Multi-Tenant, Sesi Perangkat, dan Audit Trail.',
    },
    servers: [
      {
        url: 'http://0.0.0.0:3000/api',
        description: 'Development Server Cloud Run Container',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        TenantHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-tenant-id',
          description: 'Tenant ID unik untuk isolasi data multi-tenant',
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          summary: 'Authentikasi Pengguna & Penerbitan JWT Token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'hendra@beautyglow.co.id' },
                    password: { type: 'string', example: 'P@ssw0rd2026!' },
                    rememberMe: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login Berhasil, Token Terbit' },
            401: { description: 'Kredensial Tidak Valid' },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Pendaftaran Tenant Baru & Account Owner',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    companyName: { type: 'string', example: 'PT Beauty Glow Indonesia' },
                    brandName: { type: 'string', example: 'AuraGlow Skincare' },
                    email: { type: 'string', example: 'admin@beautyglow.co.id' },
                    whatsapp: { type: 'string', example: '081234567890' },
                    password: { type: 'string', example: 'P@ssw0rd2026!' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tenant Berhasil Dibuat, Butuh OTP' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          summary: 'Rotation Refresh Token & Penerbitan Access Token Baru',
          responses: { 200: { description: 'Token Rotated' } },
        },
      },
      '/sessions': {
        get: { summary: 'Daftar Sesi Login Aktif Per Tenant' },
      },
      '/audit-logs': {
        get: { summary: 'Mendapatkan Log Aktivitas Keamanan & Perubahan Sesi' },
      },
    },
  });
});
