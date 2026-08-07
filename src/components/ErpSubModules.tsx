import React, { useState } from 'react';
import {
  Users,
  ShoppingCart,
  CalendarDays,
  Receipt,
  UserCheck,
  Wrench,
  TrendingUp,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { DataTable, Column } from './ui/DataTable';
import { formatCurrencyIDR } from '../lib/utils';

interface ErpSubModulesProps {
  moduleType: 'crm' | 'purchasing' | 'ppic' | 'finance' | 'hr' | 'maintenance';
}

export const ErpSubModules: React.FC<ErpSubModulesProps> = ({ moduleType }) => {
  // CRM & Sales Data
  const crmData = [
    {
      id: 'crm-1',
      code: 'SO-PAR-2026-081',
      client: 'Beauty Glow Indonesia (Brand Owner Maklon)',
      product: 'Brightening Serum Niacinamide 10%',
      qty: '50,000 Botol 30ml',
      totalValue: 1250000000,
      stage: 'Kontrak Maklon Disetujui',
      deliveryDate: '2026-08-25',
    },
    {
      id: 'crm-2',
      code: 'SO-PAR-2026-082',
      client: 'Skincare Botanica Nusantara',
      product: 'Sunscreen Gel SPF 50 PA++++',
      qty: '30,000 Tube 50g',
      totalValue: 900000000,
      stage: 'Sampling Formula (Lab Approved)',
      deliveryDate: '2026-09-10',
    },
  ];

  // Purchasing Data
  const purchasingData = [
    {
      id: 'po-1',
      poNumber: 'PO-RAW-2026-041',
      supplier: 'DSM Nutritional Products Ltd',
      material: 'Niacinamide PC (Grade Kosmetik)',
      qtyKg: '500 Kg',
      unitCost: 450000,
      totalAmount: 225000000,
      status: 'In Transit (Shipping from Swiss)',
      expectedDelivery: '2026-08-12',
    },
    {
      id: 'po-2',
      poNumber: 'PO-PKG-2026-092',
      supplier: 'PT Kemasan Plastik Mulia',
      material: 'Botol Dropper Kaca Frosted 30ml',
      qtyKg: '50,000 Pcs',
      unitCost: 3500,
      totalAmount: 175000000,
      status: 'Received in Warehouse (QC Checked)',
      expectedDelivery: '2026-08-04',
    },
  ];

  // PPIC Data
  const ppicData = [
    {
      id: 'sch-1',
      batchCode: 'B-2026-0801',
      formula: 'Luminance Glow Serum 10%',
      targetOutputKg: '1,000 Kg',
      plannedLine: 'Lini Homogenizer Cleanroom 1',
      startDate: '2026-08-06 08:00',
      status: 'Running MES Phase 2 (Mixing)',
    },
    {
      id: 'sch-2',
      batchCode: 'B-2026-0802',
      formula: 'Barrier Repair Moisturizer Cream',
      targetOutputKg: '800 Kg',
      plannedLine: 'Lini Emulsi Cleanroom 2',
      startDate: '2026-08-08 09:00',
      status: 'Scheduled (Raw Material Reserved)',
    },
  ];

  // Finance & Accounting Data
  const financeData = [
    {
      id: 'fin-1',
      journalNo: 'JRN-COGM-2026-0801',
      description: 'HPP Produksi Batch B-2026-0801 (Bahan Baku + Direct Labor + Factory Overhead)',
      debitCategory: 'Beban HPP Maklon',
      amountIdr: 485000000,
      status: 'Posted to General Ledger',
    },
    {
      id: 'fin-2',
      journalNo: 'JRN-INV-2026-088',
      description: 'Invoicing Brand Owner Maklon Beauty Glow Indonesia (Term 50% DP)',
      debitCategory: 'Piutang Usaha (AR)',
      amountIdr: 625000000,
      status: 'Payment Confirmed (BCA Corporate)',
    },
  ];

  // HR Data
  const hrData = [
    {
      id: 'emp-1',
      employeeId: 'EMP-QA-008',
      name: 'Apt. Maya Indah, S.Farm',
      role: 'Head of Quality Assurance & CPKB Officer',
      shift: 'Shift 1 Pagi (07:00 - 15:00)',
      attendance: 'Present (Class A Cleanroom)',
    },
    {
      id: 'emp-2',
      employeeId: 'EMP-RD-012',
      name: 'Dr. Hendra Wijaya, M.Si',
      role: 'Senior Cosmetic R&D Chemist',
      shift: 'Shift 1 Pagi (08:00 - 16:00)',
      attendance: 'Present (R&D Lab)',
    },
  ];

  // Maintenance Data
  const maintenanceData = [
    {
      id: 'maint-1',
      machineCode: 'MCH-HOMO-500L',
      machineName: 'Vacuum Homogenizer Tank 500L',
      type: 'Preventive Calibration & Mechanical Seal Check',
      lastMaintenance: '2026-07-28',
      nextScheduled: '2026-08-28',
      status: 'Optimal (OEE 86.4%)',
    },
    {
      id: 'maint-2',
      machineCode: 'MCH-FILL-AUTO-01',
      machineName: 'Monoblock Bottle Filling Machine',
      type: 'Nozzle Sterilization & Piston Replacement',
      lastMaintenance: '2026-08-01',
      nextScheduled: '2026-09-01',
      status: 'Optimal (OEE 91.2%)',
    },
  ];

  // Columns Definitions
  const crmColumns: Column<any>[] = [
    {
      key: 'code',
      header: 'No. Sales Order',
      accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.code}</span>,
    },
    {
      key: 'client',
      header: 'Klien Brand Owner Maklon',
      accessor: (item) => <span className="font-bold text-slate-100">{item.client}</span>,
    },
    {
      key: 'product',
      header: 'Produk Kosmetik Order',
      accessor: (item) => (
        <div>
          <p className="font-bold text-slate-200">{item.product}</p>
          <p className="text-[10px] text-emerald-400">{item.qty}</p>
        </div>
      ),
    },
    {
      key: 'totalValue',
      header: 'Nilai Kontrak',
      accessor: (item) => <span className="font-mono font-bold text-emerald-300">{formatCurrencyIDR(item.totalValue)}</span>,
    },
    {
      key: 'stage',
      header: 'Status Tahapan Pipeline',
      accessor: (item) => (
        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
          {item.stage}
        </span>
      ),
    },
  ];

  const purchasingColumns: Column<any>[] = [
    {
      key: 'poNumber',
      header: 'No. PO Buyer',
      accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.poNumber}</span>,
    },
    {
      key: 'supplier',
      header: 'Nama Supplier',
      accessor: (item) => <span className="font-bold text-slate-100">{item.supplier}</span>,
    },
    {
      key: 'material',
      header: 'Item Bahan / Kemasan',
      accessor: (item) => (
        <div>
          <p className="font-bold text-slate-200">{item.material}</p>
          <p className="text-[10px] text-slate-400">Jumlah: {item.qtyKg}</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Biaya PO',
      accessor: (item) => <span className="font-mono font-bold text-emerald-300">{formatCurrencyIDR(item.totalAmount)}</span>,
    },
    {
      key: 'status',
      header: 'Status Pengiriman & QC Warehouse',
      accessor: (item) => (
        <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {moduleType === 'crm' && (
        <DataTable
          title="Sales, CRM & Maklon Order Pipeline"
          subtitle="Pengelolaan prospek brand owner, kontrak kerja sama maklon, estimasi MOQ, dan penjadwalan pengiriman"
          data={crmData}
          columns={crmColumns}
          onExportCsv={() => alert('Mengeksport data Sales & CRM...')}
        />
      )}

      {moduleType === 'purchasing' && (
        <DataTable
          title="Purchasing & Strategic Raw Material Procurement"
          subtitle="Penerbitan PO, pelacakan impor bahan aktif, konfirmasi kuotasi supplier, dan penerimaan gudang"
          data={purchasingData}
          columns={purchasingColumns}
          onExportCsv={() => alert('Mengeksport data Procurement...')}
        />
      )}

      {moduleType === 'ppic' && (
        <DataTable
          title="PPIC & Production Master Scheduling"
          subtitle="Penjadwalan alokasi lini produksi cleanroom, reservasi stok FEFO, dan mitigasi kemacetan batch"
          data={ppicData}
          columns={[
            {
              key: 'batchCode',
              header: 'Kode Batch',
              accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.batchCode}</span>,
            },
            {
              key: 'formula',
              header: 'Formula',
              accessor: (item) => <span className="font-bold text-slate-100">{item.formula}</span>,
            },
            {
              key: 'plannedLine',
              header: 'Lini Cleanroom',
              accessor: (item) => <span className="text-emerald-300">{item.plannedLine}</span>,
            },
            {
              key: 'status',
              header: 'Status Eksekusi',
              accessor: (item) => (
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {item.status}
                </span>
              ),
            },
          ]}
          onExportCsv={() => alert('Mengeksport data PPIC...')}
        />
      )}

      {moduleType === 'finance' && (
        <DataTable
          title="Finance, Accounting & COGM Product Costing"
          subtitle="Kalkulasi HPP/kg otomatis, jurnal umum akuntansi, penagihan invoice brand owner, dan arus kas"
          data={financeData}
          columns={[
            {
              key: 'journalNo',
              header: 'No. Jurnal Akuntansi',
              accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.journalNo}</span>,
            },
            {
              key: 'description',
              header: 'Deskripsi Transaksi Operasional',
              accessor: (item) => <span className="font-bold text-slate-100">{item.description}</span>,
            },
            {
              key: 'amountIdr',
              header: 'Nilai Transaksi',
              accessor: (item) => <span className="font-mono font-bold text-emerald-300">{formatCurrencyIDR(item.amountIdr)}</span>,
            },
            {
              key: 'status',
              header: 'Status Jurnal',
              accessor: (item) => (
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {item.status}
                </span>
              ),
            },
          ]}
          onExportCsv={() => alert('Mengeksport data Akuntansi...')}
        />
      )}

      {moduleType === 'hr' && (
        <DataTable
          title="Human Resources & Cleanroom Personnel Attendance"
          subtitle="Manajemen sertifikasi APD Personel Cleanroom Class A, jadwal shift kerja, dan penggajian"
          data={hrData}
          columns={[
            {
              key: 'employeeId',
              header: 'NIP Karyawan',
              accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.employeeId}</span>,
            },
            {
              key: 'name',
              header: 'Nama Personel',
              accessor: (item) => <span className="font-bold text-slate-100">{item.name}</span>,
            },
            {
              key: 'role',
              header: 'Jabatan / Tanggung Jawab',
              accessor: (item) => <span className="text-slate-300">{item.role}</span>,
            },
            {
              key: 'attendance',
              header: 'Status Kehadiran Hari Ini',
              accessor: (item) => (
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {item.attendance}
                </span>
              ),
            },
          ]}
          onExportCsv={() => alert('Mengeksport data HR...')}
        />
      )}

      {moduleType === 'maintenance' && (
        <DataTable
          title="Maintenance, Preventive Service & Machine OEE"
          subtitle="Jadwal kalibrasi rutin homogenizer, pengujian kebocoran vacuum, dan monitoring OEE"
          data={maintenanceData}
          columns={[
            {
              key: 'machineCode',
              header: 'Kode Mesin',
              accessor: (item) => <span className="font-mono text-amber-400 font-bold">{item.machineCode}</span>,
            },
            {
              key: 'machineName',
              header: 'Nama Perangkat Tanki / Filling',
              accessor: (item) => <span className="font-bold text-slate-100">{item.machineName}</span>,
            },
            {
              key: 'type',
              header: 'Tindakan Pemeliharaan',
              accessor: (item) => <span className="text-slate-300">{item.type}</span>,
            },
            {
              key: 'status',
              header: 'Status Efisiensi OEE',
              accessor: (item) => (
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {item.status}
                </span>
              ),
            },
          ]}
          onExportCsv={() => alert('Mengeksport data Pemeliharaan Mesin...')}
        />
      )}
    </div>
  );
};
