export interface BlueprintSection {
  id: number;
  title: string;
  category: 'architecture' | 'database' | 'security' | 'modules' | 'roadmap' | 'ai';
  summary: string;
  details: {
    heading: string;
    points: string[];
    codeBlock?: string;
    diagramType?: 'tree' | 'network' | 'flow' | 'matrix' | 'table';
    data?: any;
  }[];
}

export const MASTER_BLUEPRINT_DATA: BlueprintSection[] = [
  {
    id: 1,
    title: '1. Arsitektur Sistem Tingkat Enterprise',
    category: 'architecture',
    summary: 'Clean Multi-Tiered Modular Architecture dengan Domain-Driven Design (DDD), Event-Driven Architecture via BullMQ, & Microservices Readiness.',
    details: [
      {
        heading: 'Prinsip Arsitektur Utama (Clean + DDD)',
        points: [
          'Presentation Layer: Front-end SPA/PWA modern dengan Next.js/React, Tailwind CSS v4, Framer Motion, TanStack Query.',
          'Application Layer: Service Orchestration, DTO Validation, Use-Case Handlers, Workflow Engine, & Audit Log Interceptors.',
          'Domain Layer: Business Rules, Entities, Value Objects, Domain Events, & Custom Validation Rules untuk Industri Kosmetik (BPOM/CPKB).',
          'Infrastructure Layer: PostgreSQL (Database), Redis (Caching & Rate Limit), BullMQ (Async Tasks & Queue), S3 Compatible (Artwork/COA Storage), Gemini 3.6 Flash (AI Center).',
        ],
        codeBlock: `
[Client Applications (Web / PWA / Mobile)]
              │ (HTTPS / WSS / REST / WebSockets)
              ▼
[Cloudflare WAF & API Gateway / Nginx Reverse Proxy]
              │
   ┌──────────┴──────────────────────────────────────────┐
   │                  NESTJS BACKEND CORE               │
   │  ┌──────────────────────────────────────────────┐  │
   │  │ Application & Auth Guards (JWT + RBAC)        │  │
   │  └──────────────────────┬───────────────────────┘  │
   │                         ▼                          │
   │  ┌──────────────────────────────────────────────┐  │
   │  │ Modules: Formula R&D | Batch MES | Regulatory │  │
   │  │          Quality QC | Warehouse | AI Engine   │  │
   │  └──────────────────────┬───────────────────────┘  │
   └──────────┬──────────────┼──────────────┬───────────┘
              │              │              │
              ▼              ▼              ▼
     [PostgreSQL Multi-Tenant] [Redis & BullMQ] [Google Gemini AI]
        (Isolated Data)      (Queue/Cache)    (16 ERP Agents)
`,
      },
    ],
  },
  {
    id: 2,
    title: '2. Struktur Folder Frontend (Next.js / React Modern)',
    category: 'architecture',
    summary: 'Modul-based frontend hierarchy separation dengan Atomic UI components, Custom Hooks, dan State Isolation.',
    details: [
      {
        heading: 'Pohon Direktori Frontend Enterprise',
        points: [
          'Modular structure: Setiap modul ERP berdiri sendiri dengan komponen, hooks, dan services tersendiri.',
          'Atomic Components: Separation antara UI Base (atoms), Business Molecules, dan Section Layouts.',
        ],
        codeBlock: `src/
├── app/                      # Next.js App Router Pages
│   ├── (auth)/               # Login, MFA, Register, Forgot Password
│   ├── (dashboard)/          # ERP Main Dashboard & Module Views
│   ├── (superadmin)/         # SaaS Super Admin Portal
│   └── api/                  # Proxy API handlers & SSE streams
├── components/
│   ├── ui/                   # Reusable Design System Components
│   ├── layout/               # Header, Sidebar, Breadcrumbs, Tenant Switcher
│   ├── modules/              # Module-specific views
│   │   ├── formula/          # INCI Lab, Costing, Phase Staging
│   │   ├── production/       # MES Batch Control, Mixer Log, Yield
│   │   ├── regulatory/       # BPOM NA, CPKB Audit, Halal Tracking
│   │   ├── quality/          # QC Swab, Micro Lab, COA Generator
│   │   └── ai-center/        # 16 Specialized AI Chat Assistants
├── hooks/                    # Reusable React Custom Hooks
├── lib/                      # Utilities, API Client, Auth Storage
├── services/                 # API Service Layer (Axios/Fetch)
└── types/                    # Shared Enterprise TypeScript Interfaces`,
      },
    ],
  },
  {
    id: 3,
    title: '3. Struktur Folder Backend (NestJS Clean Architecture)',
    category: 'architecture',
    summary: 'Modular NestJS structure dengan Repository Pattern, Dependency Injection, DTO Validation, & Exception Filters.',
    details: [
      {
        heading: 'Pohon Direktori Backend Enterprise',
        points: [
          'Domain Isolation: Setiap modul NestJS memiliki controller, service, repository, entity, DTO, dan event handlers sendiri.',
          'Tenant Awareness: Middleware otomatis menginjeksi tenant_id ke setiap ORM query.',
        ],
        codeBlock: `backend/
├── src/
│   ├── common/               # Interceptors, Filters, Guards, Decorators
│   │   ├── decorators/       # @CurrentTenant(), @Roles(), @Permissions()
│   │   ├── guards/           # JwtAuthGuard, RbacGuard, TenantGuard
│   │   └── interceptors/     # AuditLogInterceptor, TransformInterceptor
│   ├── database/             # Migrations, Seeds, Drizzle/Prisma Schema
│   ├── modules/              # Core ERP Modules
│   │   ├── tenant/           # Tenant Provisioning & Isolation
│   │   ├── license/          # Hardware/Domain Binding & Activation
│   │   ├── formula/          # R&D Formula & BPOM Threshold Check
│   │   ├── batch-mes/        # Production MES & Yield Calculations
│   │   ├── quality-qc/       # Micro Tests, Viscosity, COA Generator
│   │   ├── regulatory/       # BPOM NA Submissions & CPKB ISO 22716
│   │   └── ai-agent/         # Gemini 3.6 Flash Multi-Agent Hub
│   ├── main.ts               # Application Bootstrap
│   └── app.module.ts         # Root Dependency Injection`,
      },
    ],
  },
  {
    id: 4,
    title: '4. Struktur Database Tingkat Tinggi (PostgreSQL Normalisasi + Tenant Isolation)',
    category: 'database',
    summary: 'Schema PostgreSQL terisolasi per tenant_id dengan audit trail lengkap, foreign keys, indexing, dan soft-delete.',
    details: [
      {
        heading: 'Standar Kolom Wajib Seluruh Tabel',
        points: [
          'id: UUID primary key default gen_random_uuid()',
          'tenant_id: UUID FK ke tabel tenants(id) untuk isolasi multi-tenant',
          'created_at & updated_at: TIMESTAMPTZ otomatis dengan trigger',
          'deleted_at: TIMESTAMPTZ untuk soft delete',
          'created_by & updated_by: UUID FK ke users(id)',
          'version: INT4 untuk optimistic concurrency control',
        ],
        codeBlock: `TABLE: tenants (id, name, code, tier, status, license_key, created_at, ...)
TABLE: users (id, tenant_id, email, password_hash, role_id, is_active, mfa_secret, ...)
TABLE: raw_materials (id, tenant_id, code, inci_name, cas_num, stock_kg, cost_idr, halal_cert, ...)
TABLE: formulas (id, tenant_id, code, name, category, target_ph, target_viscosity, status, ...)
TABLE: formula_ingredients (id, tenant_id, formula_id, raw_material_id, percentage, phase, ...)
TABLE: batch_productions (id, tenant_id, batch_num, formula_id, target_kg, actual_kg, status, ...)
TABLE: quality_inspections (id, tenant_id, batch_id, ph_val, viscosity_cps, micro_cfu, status, ...)
TABLE: bpom_registrations (id, tenant_id, na_number, product_name, formula_id, status, ...)
TABLE: cpkb_audits (id, tenant_id, clause, category, status, evidence, corrective_action, ...)
TABLE: ai_audit_logs (id, tenant_id, user_id, agent_role, prompt_tokens, response, created_at)`,
      },
    ],
  },
  {
    id: 5,
    title: '5. Diagram Hubungan Modul ERP',
    category: 'modules',
    summary: 'Visualisasi keterhubungan antar modul dari R&D Formula hingga Production MES, QC Release, dan Regulatory BPOM.',
    details: [
      {
        heading: 'Workflow Hubungan Modul Kosmetik',
        points: [
          '1. Modul R&D mengembangkan Formula dengan INCI & persentase fase.',
          '2. Formula diverifikasi otomatis terhadap Regulasi BPOM & Sertifikasi Halal.',
          '3. Tim Sales/PPIC membuat Work Order Batch Production di Modul MES.',
          '4. Modul Warehouse memesan dan memesan stok Bahan Baku (Raw Material) & Packaging.',
          '5. MES memandu proses Weighing -> Mixing -> Homogenization -> Filling.',
          '6. QC mengambil sampel untuk Uji Organoleptik, pH, Viskositas, dan Uji Mikroba.',
          '7. Setelah QC Lolos, Sertifikat Analisis (COA) diterbitkan dan BPOM NA didaftarkan.',
          '8. Modul Finance mencatat Cost of Goods Manufactured (COGM) dan Jurnal Akuntansi.',
        ],
      },
    ],
  },
  {
    id: 6,
    title: '6. Diagram Alur Data (DFD) & Realtime Synchronization',
    category: 'architecture',
    summary: 'Alur data end-to-end dari permintaan pengguna, validasi JWT & Multi-tenant, eksekusi database, hingga AI Agent reasoning.',
    details: [
      {
        heading: 'Data Flow Levels',
        points: [
          'Level 0 (Context DFD): User/Mobile/Machine Sensor -> CosmoManufacture Gateway -> Database & Gemini AI.',
          'Level 1 (Batch Execution DFD): Mixer Sensors/Operator Input -> MES Controller -> Stock Deduction -> Quality Quarantine.',
          'Level 2 (AI Intelligence DFD): Business Query -> RAG / SQL Aggregator -> Context Builder -> Gemini 3.6 Flash -> Strategic Recommendation.',
        ],
      },
    ],
  },
  {
    id: 7,
    title: '7. Daftar Seluruh Modul & Dependensi',
    category: 'modules',
    summary: 'Matriks 25+ modul ERP khusus manufaktur kosmetik dan pustaka dependensinya.',
    details: [
      {
        heading: 'Matriks Modul ERP & Dependensi Utama',
        points: [
          '1. Master Data: Tenant, Plant, Line, Machine, Raw Material, Packaging Material.',
          '2. R&D Formula Lab: INCI Database, Phase A/B/C Calculator, BPOM Limit Checker.',
          '3. Batch MES: Weighing Scale Interfacing, Temperature/RPM Logger, Yield Reconciliation.',
          '4. Quality Control: Viscometer & pH Meter Log, Micro Lab Colony Counter, COA Engine.',
          '5. Regulatory BPOM: NA Application Builder, CPKB ISO 22716 Checklist, MSDS Generator.',
          '6. Warehouse & Inventory: FEFO Control, Storage Condition Monitor (Cool Room/Room Temp).',
          '7. AI Center: 16 Agent Specialist AI Engine backed by Gemini 3.6 Flash.',
          '8. Super Admin SaaS: License Key Generator, Hardware Binding Engine, Multi-Tenant Monitor.',
        ],
      },
    ],
  },
  {
    id: 8,
    title: '8. Katalog Entity Utama',
    category: 'database',
    summary: 'Definisi entitas inti bisnis kosmetik dan atribut-atribut krusialnya.',
    details: [
      {
        heading: 'Entitas Inti Kosmetik',
        points: [
          'Entity Formula: Menyimpan komposisi bahan baku, persentase fase, target pH (4.5-5.5), target viskositas, dan hasil uji stabilitas.',
          'Entity BatchProduction: Memuat lot number, target kg, actual yield, temperatur mixing, rpm homogenizer, operator log.',
          'Entity RawMaterial: Menyimpan INCI Name, CAS Number, Sertifikat Halal, COA Pemasok, Tanggal Kadaluarsa, Stok Kg.',
          'Entity BpomRegistration: Nomor NA BPOM, Masa Berlaku, Kategori Produk, Komposisi Terdaftar, Status Evaluasi.',
          'Entity QualityInspection: Nilai pH, Viskositas cPs, Specific Gravity, Angka Lempeng Total (ALT) CFU/g, Status Lolos.',
        ],
      },
    ],
  },
  {
    id: 9,
    title: '9. Hirarki Role Pengguna & Akses Enterprise',
    category: 'security',
    summary: 'Struktur Role-Based Access Control (RBAC) bertingkat untuk keamanan enterprise.',
    details: [
      {
        heading: 'Role Hierarchy',
        points: [
          '1. SaaS Super Admin: Pengelolaan Tenant, License Key, Monitoring Platform, System Health.',
          '2. Tenant Director / CEO: Akses Dashboard Executive, Financial Analytics, AI Executive Assistant.',
          '3. R&D Formulator / Chemist: Akses Modul Formula, INCI Checker, Sample Development, Stability Log.',
          '4. Regulatory Officer: Akses Modul BPOM NA, Dokumen CPKB, MSDS, Halal MUI Compliance.',
          '5. Production Manager / Operator: Akses Modul MES, Batch Production Control, Work Order, Mixer Log.',
          '6. Quality Control Inspector: Akses Modul QC, Parameter Testing, Micro Lab, COA Issuance.',
          '7. Warehouse Specialist: Akses Stock Opname, FEFO Tracking, Material Requisition.',
          '8. Finance & Accounting Manager: Akses COGM, Cashflow, Invoicing, Costing Analysis.',
        ],
      },
    ],
  },
  {
    id: 10,
    title: '10. Matriks Permission Granular (RBAC)',
    category: 'security',
    summary: 'Matriks izin akses sampai tingkat action level (Create, Read, Update, Delete, Approve, Export).',
    details: [
      {
        heading: 'Skema Izin Akses',
        points: [
          'formula:create, formula:read, formula:update, formula:approve_version, formula:export_pdf',
          'batch:schedule, batch:execute_step, batch:log_temperature, batch:record_yield',
          'qc:inspect, qc:approve_micro, qc:issue_coa, qc:quarantine_batch',
          'bpom:submit, bpom:update_na_number, bpom:audit_cpkb',
          'tenant:manage, license:activate, license:revoke',
        ],
      },
    ],
  },
  {
    id: 11,
    title: '11. Roadmap Pengembangan & Fase Rilis',
    category: 'roadmap',
    summary: 'Rencana kerja iteratif pengembangan CosmoManufacture AI ERP.',
    details: [
      {
        heading: 'Fase Pengembangan',
        points: [
          'Fase 1 (Fondasi & Blueprint): Arsitektur Multi-Tenant, License System, Design System Emerald Glassmorphism, Master Data.',
          'Fase 2 (Core R&D & MES): Formula Lab, INCI Checker, BPOM Threshold Engine, Batch Production Engine.',
          'Fase 3 (Quality & Regulatory): QC Laboratory System, COA Generator, CPKB ISO 22716 Checklist, BPOM Integration.',
          'Fase 4 (AI Center & Analytics): Gemini 3.6 Flash 16 ERP Agent Assistants, Predictive Yield, Cashflow & Inventory Forecast.',
          'Fase 5 (Enterprise SaaS Launch): Super Admin Portal, Automated Billing, Hardware Binding, Mobile PWA Release.',
        ],
      },
    ],
  },
  {
    id: 12,
    title: '12. Strategi Deployment Multi-Region Cloud',
    category: 'architecture',
    summary: 'Arsitektur infrastruktur Cloud Run / Kubernetes dengan High Availability & Zero-Downtime Deployment.',
    details: [
      {
        heading: 'Infrastruktur Cloud',
        points: [
          'Containerization: Docker + Multi-stage Dockerfile untuk build ringan.',
          'Orchestration: Google Cloud Run / Kubernetes (GKE) dengan Auto-Scaling 1 hingga 50 pod.',
          'CDN & Protection: Cloudflare Enterprise dengan DDoS Mitigation & SSL Wildcard.',
          'Database Managed: PostgreSQL Cloud SQL dengan Read Replica & Automated Daily Snapshots.',
        ],
      },
    ],
  },
  {
    id: 13,
    title: '13. Strategi High-Scale Infrastructure & Caching',
    category: 'architecture',
    summary: 'Cepat, tangguh, dan dapat menangani ribuan batch bersamaan dengan Redis caching.',
    details: [
      {
        heading: 'Optimasi Performa',
        points: [
          'Redis Cache Layer: In-memory caching untuk Formula Master Data, INCI definitions, dan Permission matrices.',
          'BullMQ Asynchronous Queue: Pemrosesan background job untuk pencetakan COA PDF, Sinkronisasi BPOM, dan AI Assistant Reasoning.',
          'Database Indexing: B-Tree Indexes pada tenant_id, batch_number, formula_code, dan na_number.',
        ],
      },
    ],
  },
  {
    id: 14,
    title: '14. Strategi Keamanan, ISO 27001 & Compliance',
    category: 'security',
    summary: 'Keamanan data tingkat bank untuk mencegah kebocoran antar tenant dan memenuhi standar CPKB & ISO 22716.',
    details: [
      {
        heading: 'Standar Keamanan',
        points: [
          'Enkripsi Data: TLS 1.3 in-transit dan AES-256 at-rest untuk field sensitif (formula rahasia).',
          'Audit Log Lengkap: Mencatat setiap perubahan formula, override QC, dan akses data tenant.',
          'MFA & Device Fingerprinting: Perlindungan akun pengguna dengan Google Authenticator OTP.',
          'IP Whitelisting: Pembatasan akses mesin produksi hanya dari IP lokal pabrik.',
        ],
      },
    ],
  },
  {
    id: 15,
    title: '15. Standar Coding & Clean Architecture Patterns',
    category: 'architecture',
    summary: 'Aturan penulisan kode TypeScript strictly-typed, SOLID principles, dan ESLint validation.',
    details: [
      {
        heading: 'Prinsip Kualitas Kode',
        points: [
          'Strict TypeScript: noImplicitAny, strictNullChecks, noUnusedLocals.',
          'Dependency Injection: Inversi ketergantungan agar unit testing mudah dijalankan.',
          'Error Handling Terpusat: Custom Exception Filters dengan HTTP Status Code standar.',
        ],
      },
    ],
  },
  {
    id: 16,
    title: '16. Konvensi Penamaan Enterprise',
    category: 'architecture',
    summary: 'Standard penamaan universal untuk Frontend, Backend, dan Database Schema.',
    details: [
      {
        heading: 'Aturan Penamaan',
        points: [
          'Database Tables & Columns: snake_case (misal: batch_productions, target_ph).',
          'TypeScript Classes & Interfaces: PascalCase (misal: BatchProductionService, FormulaEntity).',
          'TypeScript Variables & Functions: camelCase (misal: calculateYieldPercentage, getBpomStatus).',
          'API Endpoints: kebab-case dengan plural noun (misal: /api/v1/batch-productions, /api/v1/quality-inspections).',
        ],
      },
    ],
  },
  {
    id: 17,
    title: '17. Standar UI/UX Enterprise (Emerald Glassmorphism & Luxury Theme)',
    category: 'architecture',
    summary: 'Desain visual kelas tinggi yang dirancang untuk manajer pabrik hingga formulator laboratorium.',
    details: [
      {
        heading: 'Aturan Visual & Layout',
        points: [
          'Warna Utama: Emerald (#059669) melambangkan keaslian & kebersihan kosmetik, Navy (#0f172a) untuk struktur enterprise, Gold (#d97706) untuk elemen berharga.',
          'Gaya Design: Soft Glassmorphism, Micro-interactions dengan Framer Motion, Typography Sans-Serif bersih.',
          'Responsif: Kompatibel sempurna di Laptop 4K, Tablet Pabrik, hingga HP Operator.',
        ],
      },
    ],
  },
  {
    id: 18,
    title: '18. Strategi Integrasi AI & Multi-Agent Matrix',
    category: 'ai',
    summary: 'Pusat AI berbasis Gemini 3.6 Flash dengan 16 Asisten ERP Khusus yang membaca konteks database realtime.',
    details: [
      {
        heading: '16 Spesiakisasi Asisten AI ERP',
        points: [
          '1. CEO Assistant: Strategi bisnis, analisis margin laba, dan tren pasar kosmetik.',
          '2. R&D Chemist Assistant: Rekomendasi formulasi, pencocokan INCI, dan optimasi biaya/kg.',
          '3. Regulatory Assistant: Cek kepatuhan BPOM NA, penyusunan dokumen CPKB, dan evaluasi MSDS.',
          '4. Production Assistant: Prediksi bottleneck produksi, optimasi OEE, dan pengurangan downtime mixer.',
          '5. Quality Auditor Assistant: Analisis akar masalah kecacatan produk (root cause failure analysis) dan tren mikrobiologi.',
          '6. Inventory Assistant: Prediksi reorder point bahan baku sensitif kadaluarsa (FEFO).',
          '7. Finance Assistant: Forecast cashflow dan simulasi COGM terhadap kenaikan harga bahan baku.',
          '8. Maintenance Assistant: Jadwal perawatan prediktif mesin emulsifier dan homogenizer.',
        ],
      },
    ],
  },
  {
    id: 19,
    title: '19. Strategi Multi-Tenant & Isolasi Data SaaS',
    category: 'security',
    summary: 'Pemisahan data mutlak antar pabrik maklon dan brand owner.',
    details: [
      {
        heading: 'Model Isolasi Multi-Tenant',
        points: [
          'Pooled Database dengan Row-Level Security (RLS) via tenant_id.',
          'SaaS License Key Engine: Validasi Lisensi Online & Offline dengan Hardware Binding Hash.',
          'Grace Period Automation: Alert otomatis sebelum lisensi expired dengan batasan akses read-only.',
        ],
      },
    ],
  },
  {
    id: 20,
    title: '20. Transisi Siap untuk Prompt 2 (UI Execution Ready)',
    category: 'roadmap',
    summary: 'Fondasi arsitektur siap dihubungkan langsung ke antarmuka aplikasi interaktif dan komponen reusable.',
    details: [
      {
        heading: 'Kesiapan Implementasi UI',
        points: [
          'Design Token Terdefinisi (Emerald, Navy, Gold, Glassmorphism).',
          'Master Mock Data Kosmetik Lengkap (Formulasi Serum, Batch Production, BPOM NA, CPKB, COA).',
          'Interactive Layout Siap Digunakan dengan Sidebar Navigation, Executive Dashboard, Lab Modules, & Gemini AI Hub.',
        ],
      },
    ],
  },
];
