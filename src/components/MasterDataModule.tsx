import React, { useState } from 'react';
import {
  Database,
  Building2,
  Factory,
  Boxes,
  Users,
  Truck,
  Cpu,
  FlaskConical,
  PackageCheck,
  Search,
  Plus,
} from 'lucide-react';
import { DataTable, Column } from './ui/DataTable';
import { MOCK_RAW_MATERIALS } from '../data/mockErpData';

export const MasterDataModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'factories' | 'suppliers' | 'machines'>('materials');

  // Sample data for Factories
  const factoriesData = [
    {
      id: 'f-1',
      code: 'FCT-CIBITUNG-01',
      name: 'Pabrik Utama Cikarang (Cleanroom Class A)',
      location: 'Kawasan Industri MM2100, Cikarang',
      capacity: '500,000 unit/bulan',
      bpomLicense: 'CPKB-CLASS-A-2024-001',
      status: 'Active',
    },
    {
      id: 'f-2',
      code: 'FCT-SIDOARJO-02',
      name: 'Pabrik Formulasi Liquid & Emulsi Sidoarjo',
      location: 'Kawasan Industri Rungkut, Jawa Timur',
      capacity: '350,000 unit/bulan',
      bpomLicense: 'CPKB-CLASS-A-2024-008',
      status: 'Active',
    },
  ];

  // Sample data for Suppliers
  const suppliersData = [
    {
      id: 'sup-1',
      code: 'SUP-DSM-01',
      name: 'DSM Nutritional Products Ltd',
      country: 'Swiss / Netherlands',
      materialsSupplied: 'Niacinamide PC, Hyaluronic Acid',
      halalStatus: 'MUI Certified',
      gradeRating: 'Tier 1 Certified',
    },
    {
      id: 'sup-2',
      code: 'SUP-BASF-02',
      name: 'BASF Care Creations',
      country: 'Germany / Singapore',
      materialsSupplied: 'Emulsifiers, Cetearyl Alcohol',
      halalStatus: 'JAKIM / MUI Certified',
      gradeRating: 'Tier 1 Certified',
    },
    {
      id: 'sup-3',
      code: 'SUP-CRODA-03',
      name: 'Croda Personal Care',
      country: 'United Kingdom',
      materialsSupplied: 'Polysorbate 20, Bio-Active Actives',
      halalStatus: 'MUI Certified',
      gradeRating: 'Tier 1 Certified',
    },
  ];

  // Sample data for Machines
  const machinesData = [
    {
      id: 'm-1',
      code: 'MCH-HOMO-500L',
      name: 'Vacuum Homogenizer Tank 500 Liter',
      line: 'Lini Emulsi Utama Cleanroom 1',
      maxRpm: '4,000 RPM',
      heatingCap: 'Jacketed Steam 95°C',
      status: 'Operational (OEE 86.4%)',
    },
    {
      id: 'm-2',
      code: 'MCH-FILL-AUTO-01',
      name: 'Automatic Monoblock Bottle Filling & Capping Machine',
      line: 'Lini Pengisian Botol Serum 30ml',
      maxRpm: '3,600 bph',
      heatingCap: 'N/A',
      status: 'Operational (OEE 91.2%)',
    },
  ];

  // Columns for Raw Materials
  const rawMaterialColumns: Column<any>[] = [
    {
      key: 'code',
      header: 'Kode Material',
      accessor: (item) => (
        <span className="font-mono text-amber-400 font-bold">{item.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Nama Bahan Baku',
      accessor: (item) => (
        <div>
          <p className="font-bold text-slate-100">{item.name}</p>
          <p className="text-[10px] font-mono text-slate-400">{item.inciName}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      accessor: (item) => (
        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-300">
          {item.category}
        </span>
      ),
    },
    {
      key: 'stockQuantityKg',
      header: 'Stok Fisik',
      accessor: (item) => (
        <span className="font-mono font-bold text-emerald-300">
          {item.stockQuantityKg} Kg
        </span>
      ),
    },
    {
      key: 'halalCertNumber',
      header: 'Halal MUI',
      accessor: (item) => (
        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
          {item.halalCertNumber}
        </span>
      ),
    },
  ];

  // Columns for Factories
  const factoryColumns: Column<any>[] = [
    {
      key: 'code',
      header: 'Kode Pabrik',
      accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.code}</span>,
    },
    {
      key: 'name',
      header: 'Nama Fasilitas & Cleanroom',
      accessor: (item) => (
        <div>
          <p className="font-bold text-slate-100">{item.name}</p>
          <p className="text-[10px] text-slate-400">{item.location}</p>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Kapasitas Output',
      accessor: (item) => <span className="font-mono text-emerald-300">{item.capacity}</span>,
    },
    {
      key: 'bpomLicense',
      header: 'Izin Industri BPOM',
      accessor: (item) => (
        <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
          {item.bpomLicense}
        </span>
      ),
    },
  ];

  // Columns for Suppliers
  const supplierColumns: Column<any>[] = [
    {
      key: 'code',
      header: 'Kode Supplier',
      accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.code}</span>,
    },
    {
      key: 'name',
      header: 'Nama Perusahaan Supplier',
      accessor: (item) => (
        <div>
          <p className="font-bold text-slate-100">{item.name}</p>
          <p className="text-[10px] text-slate-400">{item.country}</p>
        </div>
      ),
    },
    {
      key: 'materialsSupplied',
      header: 'Bahan Baku Pasokan',
      accessor: (item) => <span className="text-slate-300">{item.materialsSupplied}</span>,
    },
    {
      key: 'halalStatus',
      header: 'Sertifikasi Halal Global',
      accessor: (item) => (
        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
          {item.halalStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Database className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Master Data Management Center — Enterprise Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pusat data master pabrik, lini produksi cleanroom, pemasok bahan aktif global, direktori mesin homogenizer, dan repositori bahan baku kosmetik.
          </p>
        </div>

        <button
          onClick={() => alert('Membuka form pendaftaran Master Data baru...')}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Master Data Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'materials'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bahan Baku & Packaging
        </button>
        <button
          onClick={() => setActiveTab('factories')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'factories'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fasilitas Pabrik & Cleanroom
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'suppliers'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pemasok Bahan Aktif Global
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'materials' && (
        <DataTable
          title="Master Bahan Baku & INCI Cosmetic Repository"
          subtitle="Daftar lengkap bahan baku aktif, emulsifier, pengawet, dan kemasan primer"
          data={MOCK_RAW_MATERIALS}
          columns={rawMaterialColumns}
          onExportCsv={() => alert('Mengeksport data Master Bahan Baku ke CSV/Excel...')}
        />
      )}

      {activeTab === 'factories' && (
        <DataTable
          title="Direktori Fasilitas Pabrik & Lini Cleanroom Class A"
          subtitle="Gedung manufaktur terintegrasi dengan standar sertifikasi CPKB BPOM"
          data={factoriesData}
          columns={factoryColumns}
          onExportCsv={() => alert('Mengeksport data Pabrik...')}
        />
      )}

      {activeTab === 'suppliers' && (
        <DataTable
          title="Direktori Pemasok Bahan Aktif Kosmetik Global"
          subtitle="Pemasok bahan baku bersertifikat MUI, ISO, dan Audit Supplier CPKB"
          data={suppliersData}
          columns={supplierColumns}
          onExportCsv={() => alert('Mengeksport data Supplier...')}
        />
      )}
    </div>
  );
};
