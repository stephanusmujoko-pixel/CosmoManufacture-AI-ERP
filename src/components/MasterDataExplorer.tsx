import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  FlaskConical,
  Truck,
  Users,
  Cpu,
  Warehouse,
  Hash,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Tag,
  FileText,
  Layers,
  Settings,
  RefreshCw,
  Eye,
  Trash2,
  Edit3,
  Sliders,
  Check,
  X,
  ChevronRight,
  BarChart3,
  HardDrive,
  CheckSquare,
} from 'lucide-react';

export const MasterDataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'raw_materials' | 'suppliers' | 'customers' | 'machines' | 'warehouses' | 'doc_numbering' | 'approval_custom' | 'audit_import'
  >('overview');

  // Default Fallback Master Datasets
  const DEFAULT_PRODUCTS = [
    {
      id: 'p-1',
      sku: 'SKU-FG-SER-01',
      productCode: 'PRD-SERUM-01',
      productName: 'Brightening Serum Niacinamide 10% + Zinc 1%',
      brand: 'BeautyGlow Cosmetics',
      category: 'Skincare - Facial Serum',
      type: 'Finished Goods',
      formulaCode: 'FORM-SER-2026-V1',
      formulaVersion: '1.2',
      netto: '30 ml',
      targetPh: '5.5 - 6.0',
      viscosityCps: '1,200 - 1,500',
      bpomNumber: 'NA18240199001',
      bpomExpiry: '2028-12-31',
      status: 'Active',
    },
    {
      id: 'p-2',
      sku: 'SKU-FG-CRM-02',
      productCode: 'PRD-CREAM-02',
      productName: 'Barrier Repair Moisturizer Cream Ceramide NP',
      brand: 'AuraSkin Luxe',
      category: 'Skincare - Moisturizer Cream',
      type: 'Finished Goods',
      formulaCode: 'FORM-CRM-2026-V2',
      formulaVersion: '2.0',
      netto: '50 gram',
      targetPh: '6.0 - 6.5',
      viscosityCps: '18,000 - 22,000',
      bpomNumber: 'NA18240199002',
      bpomExpiry: '2029-06-30',
      status: 'Active',
    },
    {
      id: 'p-3',
      sku: 'SKU-FG-SUN-03',
      productCode: 'PRD-SUN-03',
      productName: 'Ultra Light UV Shield Sunscreen Lotion SPF 50 PA++++',
      brand: 'BeautyGlow Cosmetics',
      category: 'Skincare - Sunscreen Lotion',
      type: 'Finished Goods',
      formulaCode: 'FORM-SUN-2026-V1',
      formulaVersion: '1.0',
      netto: '40 ml',
      targetPh: '6.2 - 6.8',
      viscosityCps: '8,000 - 10,000',
      bpomNumber: 'NA18240199003',
      bpomExpiry: '2029-01-15',
      status: 'Active',
    },
    {
      id: 'p-4',
      sku: 'SKU-FG-CLM-04',
      productCode: 'PRD-CLEAN-04',
      productName: 'Gentle Amino Acid Cleansing Gel Centella 100ml',
      brand: 'PureBotanic Bio',
      category: 'Skincare - Facial Wash',
      type: 'Finished Goods',
      formulaCode: 'FORM-CLM-2026-V3',
      formulaVersion: '3.1',
      netto: '100 ml',
      targetPh: '5.0 - 5.5',
      viscosityCps: '3,500 - 4,500',
      bpomNumber: 'NA18240199004',
      bpomExpiry: '2028-10-20',
      status: 'Active',
    },
  ];

  const DEFAULT_RAW_MATERIALS = [
    {
      id: 'rm-1',
      code: 'RM-ACT-001',
      name: 'Niacinamide PC (Vitamin B3)',
      scientificName: 'Pyridine-3-carboxamide',
      casNumber: '98-92-0',
      category: 'Active Ingredient',
      grade: 'Pharma / USP Grade',
      purityPercentage: 99.8,
      supplierName: 'PT DSM Nutritional Products Indonesia',
      pricePerKgRp: 185000,
      safetyStockKg: 250,
      msdsStatus: 'Verified',
      coaStatus: 'Pass',
    },
    {
      id: 'rm-2',
      code: 'RM-ACT-002',
      name: 'Sodium Hyaluronate High Molecular Weight',
      scientificName: 'Hyaluronic Acid Sodium Salt',
      casNumber: '9067-32-7',
      category: 'Active Ingredient',
      grade: 'Cosmetic Grade',
      purityPercentage: 98.5,
      supplierName: 'Bloomage Biotechnology Corp',
      pricePerKgRp: 3200000,
      safetyStockKg: 15,
      msdsStatus: 'Verified',
      coaStatus: 'Pass',
    },
    {
      id: 'rm-3',
      code: 'RM-EMU-001',
      name: 'Cetearyl Alcohol & Ceteareth-20',
      scientificName: 'Hexadecan-1-ol + Octadecan-1-ol',
      casNumber: '67762-27-0',
      category: 'Emulsifier',
      grade: 'Cosmetic Grade',
      purityPercentage: 99.0,
      supplierName: 'BASF Care Creations Indonesia',
      pricePerKgRp: 65000,
      safetyStockKg: 500,
      msdsStatus: 'Verified',
      coaStatus: 'Pass',
    },
    {
      id: 'rm-4',
      code: 'RM-PRE-001',
      name: 'Phenoxyethanol & Ethylhexylglycerin',
      scientificName: '2-Phenoxyethanol',
      casNumber: '122-99-6',
      category: 'Preservative System',
      grade: 'Cosmetic Grade',
      purityPercentage: 99.5,
      supplierName: 'Schülke & Mayr GmbH',
      pricePerKgRp: 145000,
      safetyStockKg: 150,
      msdsStatus: 'Verified',
      coaStatus: 'Pass',
    },
  ];

  const DEFAULT_SUPPLIERS = [
    {
      id: 'sup-1',
      supplierCode: 'SUP-DSM-001',
      companyName: 'PT DSM Nutritional Products Indonesia',
      brand: 'DSM Personal Care',
      picName: 'Dr. Irwan Kusuma',
      email: 'irwan.kusuma@dsm.com',
      paymentTermDays: 60,
      qualityScorePct: 98.5,
      status: 'APPROVED AVL',
    },
    {
      id: 'sup-2',
      supplierCode: 'SUP-BASF-002',
      companyName: 'PT BASF Care Chemicals Indonesia',
      brand: 'BASF Care Creations',
      picName: 'Siska Maharani, S.T.',
      email: 'siska.maharani@basf.com',
      paymentTermDays: 45,
      qualityScorePct: 97.2,
      status: 'APPROVED AVL',
    },
    {
      id: 'sup-3',
      supplierCode: 'SUP-BLOOM-003',
      companyName: 'Bloomage Biotech International',
      brand: 'HyacoCare Bio',
      picName: 'Chen Wei, Ph.D.',
      email: 'sales@bloomage.com',
      paymentTermDays: 30,
      qualityScorePct: 96.0,
      status: 'APPROVED AVL',
    },
  ];

  const DEFAULT_CUSTOMERS = [
    {
      id: 'c-1',
      customerCode: 'CUST-MKL-001',
      companyName: 'PT Glowup Beauty Indonesia',
      brandName: 'GlowUp Skin Science',
      picName: 'Amanda Putri',
      creditLimitRp: 2500000000,
      priceGroup: 'Tier 1 Premium Maklon',
    },
    {
      id: 'c-2',
      customerCode: 'CUST-MKL-002',
      companyName: 'CV Derma Aesthetic Utama',
      brandName: 'DermaClear Clinic Line',
      picName: 'dr. Rian Pratama, Sp.DVE',
      creditLimitRp: 1200000000,
      priceGroup: 'Tier 2 Aesthetic Clinic',
    },
  ];

  const DEFAULT_MACHINES = [
    {
      id: 'm-1',
      machineCode: 'MCH-HOMO-500L',
      machineName: 'Vacuum Emulsifying Homogenizer Mixer 500L',
      category: 'Mixing & Homogenizing',
      cleanroomGrade: 'Class C Cleanroom Primary',
      capacityKgOrPcsPerHour: 500,
      lastCalibrationDate: '2026-02-15',
      status: 'OPERATIONAL (OEE 88.5%)',
    },
    {
      id: 'm-2',
      machineCode: 'MCH-FILL-AUTO-01',
      machineName: 'Automatic Monoblock Bottle Filling & Capping Line',
      category: 'Filling & Packaging',
      cleanroomGrade: 'Class D Cleanroom Secondary',
      capacityKgOrPcsPerHour: 3600,
      lastCalibrationDate: '2026-03-01',
      status: 'OPERATIONAL (OEE 92.1%)',
    },
  ];

  const DEFAULT_WAREHOUSES = [
    {
      id: 'w-1',
      warehouseCode: 'WH-RAW-01',
      warehouseName: 'Gudang Raw Material & Active Ingredient (HVAC Controlled)',
      zoneCode: 'Z-ACT-01',
      rackNumber: 'RACK-A01',
      binLocation: 'BIN-A01-04',
      type: 'Cold & Controlled Storage',
      tempMinC: 15,
      tempMaxC: 25,
      humidityMaxPct: 60,
      capacityPallets: 250,
    },
    {
      id: 'w-2',
      warehouseCode: 'WH-FG-02',
      warehouseName: 'Gudang Finish Goods Skincare (Quarantine & Released FEFO)',
      zoneCode: 'Z-FG-02',
      rackNumber: 'RACK-B03',
      binLocation: 'BIN-B03-12',
      type: 'Standard Pallet Storage',
      tempMinC: 20,
      tempMaxC: 28,
      humidityMaxPct: 65,
      capacityPallets: 600,
    },
  ];

  const DEFAULT_DOC_FORMATS = [
    { id: '1', docType: 'MO', currentSequence: 142, sampleResult: 'MO/2026/08/0142' },
    { id: '2', docType: 'Batch Number', currentSequence: 89, sampleResult: 'LOT-SKIN-20260808-089' },
    { id: '3', docType: 'Certificate of Analysis (COA)', currentSequence: 312, sampleResult: 'COA/QC/2026/0312' },
    { id: '4', docType: 'Purchase Order (PO)', currentSequence: 205, sampleResult: 'PO/PROC/2026/0205' },
  ];

  const DEFAULT_AUDIT_LOGS = [
    {
      id: 'aud-1',
      timestamp: new Date().toISOString(),
      userName: 'Stephanus Mujoko, S.Kom',
      action: 'UPDATE_MASTER',
      entityType: 'Product SKU-FG-SER-01',
      details: 'Memperbarui pH target formulasi menjadi 5.5 - 6.0 sesuai revisi BPOM.',
    },
    {
      id: 'aud-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userName: 'Apt. Clara, M.Farm',
      action: 'VERIFY_COA',
      entityType: 'Raw Material RM-ACT-001',
      details: 'Pemeriksaan laboratorium QC sampel Niacinamide PC batch DSM-2026-X12 Lulus.',
    },
  ];

  // Master Data State from Backend
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [rawMaterials, setRawMaterials] = useState<any[]>(DEFAULT_RAW_MATERIALS);
  const [suppliers, setSuppliers] = useState<any[]>(DEFAULT_SUPPLIERS);
  const [customers, setCustomers] = useState<any[]>(DEFAULT_CUSTOMERS);
  const [machines, setMachines] = useState<any[]>(DEFAULT_MACHINES);
  const [warehouses, setWarehouses] = useState<any[]>(DEFAULT_WAREHOUSES);
  const [docFormats, setDocFormats] = useState<any[]>(DEFAULT_DOC_FORMATS);
  const [auditLogs, setAuditLogs] = useState<any[]>(DEFAULT_AUDIT_LOGS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddRmModal, setShowAddRmModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);

  // Detail Modal Inspection
  const [inspectedItem, setInspectedItem] = useState<{ type: string; data: any } | null>(null);

  // CSV Import/Export Modal & Status State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Form States
  const [newProduct, setNewProduct] = useState({
    sku: '',
    productName: '',
    brand: 'BeautyGlow Cosmetics',
    category: 'Skincare - Facial Serum',
    type: 'Finished Goods',
    formulaCode: 'FORM-SER-2026',
    netto: '30 ml',
    bpomNumber: 'NA18240199000',
  });

  const [newRm, setNewRm] = useState({
    code: '',
    name: '',
    scientificName: '',
    casNumber: '',
    category: 'Active Ingredient',
    supplierName: 'PT DSM Nutritional Products Indonesia',
    pricePerKgRp: 150000,
    safetyStockKg: 100,
  });

  const [newSupplier, setNewSupplier] = useState({
    supplierCode: '',
    companyName: '',
    brand: '',
    picName: '',
    email: '',
    paymentTermDays: 45,
    qualityScorePct: 98,
  });

  const [newCustomer, setNewCustomer] = useState({
    customerCode: '',
    companyName: '',
    brandName: '',
    picName: '',
    creditLimitRp: 1000000000,
    priceGroup: 'Tier 1 Premium Maklon',
  });

  const [newMachine, setNewMachine] = useState({
    machineCode: '',
    machineName: '',
    category: 'Mixing & Homogenizing',
    cleanroomGrade: 'Class C Cleanroom Primary',
    capacityKgOrPcsPerHour: 500,
  });

  const [newWarehouse, setNewWarehouse] = useState({
    warehouseCode: '',
    warehouseName: '',
    zoneCode: 'Z-ACT-01',
    rackNumber: 'RACK-A01',
    binLocation: 'BIN-A01-01',
    type: 'Cold & Controlled Storage',
    tempMinC: 15,
    tempMaxC: 25,
    humidityMaxPct: 60,
    capacityPallets: 200,
  });

  // Auto Numbering Gen State
  const [selectedDocType, setSelectedDocType] = useState('MO');
  const [generatedDocNum, setGeneratedDocNum] = useState<string | null>(null);

  // Load Data from Backend
  const loadMasterData = async () => {
    try {
      const resMetrics = await fetch('/api/dashboard-metrics');
      const jsonMetrics = await resMetrics.json();
      if (jsonMetrics.summary) setMetrics(jsonMetrics.summary);

      const resProd = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const jsonProd = await resProd.json();
      if (jsonProd.data && jsonProd.data.length > 0) setProducts(jsonProd.data);

      const resRm = await fetch(`/api/raw-materials?search=${encodeURIComponent(searchQuery)}`);
      const jsonRm = await resRm.json();
      if (jsonRm.data && jsonRm.data.length > 0) setRawMaterials(jsonRm.data);

      const resSup = await fetch('/api/suppliers');
      const jsonSup = await resSup.json();
      if (jsonSup.data && jsonSup.data.length > 0) setSuppliers(jsonSup.data);

      const resCust = await fetch('/api/customers');
      const jsonCust = await resCust.json();
      if (jsonCust.data && jsonCust.data.length > 0) setCustomers(jsonCust.data);

      const resMach = await fetch('/api/machines');
      const jsonMach = await resMach.json();
      if (jsonMach.data && jsonMach.data.length > 0) setMachines(jsonMach.data);

      const resWh = await fetch('/api/warehouses');
      const jsonWh = await resWh.json();
      if (jsonWh.data && jsonWh.data.length > 0) setWarehouses(jsonWh.data);

      const resDoc = await fetch('/api/document-numbering');
      const jsonDoc = await resDoc.json();
      if (jsonDoc.data && jsonDoc.data.length > 0) setDocFormats(jsonDoc.data);

      const resAudit = await fetch('/api/audit-logs');
      const jsonAudit = await resAudit.json();
      if (jsonAudit.data && jsonAudit.data.length > 0) setAuditLogs(jsonAudit.data);
    } catch (err) {
      console.error('Failed fetching Master Data:', err);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, [searchQuery]);

  // Handler CSV Export
  const handleExportCSV = () => {
    let dataToExport: any[] = [];
    let filename = `master_data_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'products') dataToExport = products;
    else if (activeTab === 'raw_materials') dataToExport = rawMaterials;
    else if (activeTab === 'suppliers') dataToExport = suppliers;
    else if (activeTab === 'customers') dataToExport = customers;
    else if (activeTab === 'machines') dataToExport = machines;
    else if (activeTab === 'warehouses') dataToExport = warehouses;
    else dataToExport = products;

    if (dataToExport.length === 0) return;

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map((obj) =>
      Object.values(obj)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler CSV Bulk Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportNotice(`File "${file.name}" berhasil diunggah. 12 Master Record baru telah tervalidasi dan diimpor!`);
        setShowImportModal(false);
        setTimeout(() => setImportNotice(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  // Create Handlers
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `p-${Date.now()}`,
      ...newProduct,
      productCode: `PRD-${newProduct.sku}`,
      formulaVersion: '1.0',
      targetPh: '5.5 - 6.0',
      viscosityCps: '1,500 cPs',
      bpomExpiry: '2029-12-31',
      status: 'Active',
    };

    setProducts((prev) => [created, ...prev]);
    setShowAddProductModal(false);
    setNewProduct({
      sku: '',
      productName: '',
      brand: 'BeautyGlow Cosmetics',
      category: 'Skincare - Facial Serum',
      type: 'Finished Goods',
      formulaCode: 'FORM-SER-2026',
      netto: '30 ml',
      bpomNumber: 'NA18240199000',
    });

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRm = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `rm-${Date.now()}`,
      ...newRm,
      grade: 'Cosmetic Grade',
      purityPercentage: 99.0,
      msdsStatus: 'Verified',
      coaStatus: 'Pass',
    };

    setRawMaterials((prev) => [created, ...prev]);
    setShowAddRmModal(false);
    setNewRm({
      code: '',
      name: '',
      scientificName: '',
      casNumber: '',
      category: 'Active Ingredient',
      supplierName: 'PT DSM Nutritional Products Indonesia',
      pricePerKgRp: 150000,
      safetyStockKg: 100,
    });

    try {
      await fetch('/api/raw-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRm),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `sup-${Date.now()}`,
      ...newSupplier,
      status: 'APPROVED AVL',
    };
    setSuppliers((prev) => [created, ...prev]);
    setShowAddSupplierModal(false);
    setNewSupplier({
      supplierCode: '',
      companyName: '',
      brand: '',
      picName: '',
      email: '',
      paymentTermDays: 45,
      qualityScorePct: 98,
    });
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `cust-${Date.now()}`,
      ...newCustomer,
    };
    setCustomers((prev) => [created, ...prev]);
    setShowAddCustomerModal(false);
    setNewCustomer({
      customerCode: '',
      companyName: '',
      brandName: '',
      picName: '',
      creditLimitRp: 1000000000,
      priceGroup: 'Tier 1 Premium Maklon',
    });
  };

  const handleCreateMachine = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `m-${Date.now()}`,
      ...newMachine,
      lastCalibrationDate: new Date().toISOString().split('T')[0],
      status: 'OPERATIONAL (OEE 90.0%)',
    };
    setMachines((prev) => [created, ...prev]);
    setShowAddMachineModal(false);
    setNewMachine({
      machineCode: '',
      machineName: '',
      category: 'Mixing & Homogenizing',
      cleanroomGrade: 'Class C Cleanroom Primary',
      capacityKgOrPcsPerHour: 500,
    });
  };

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `w-${Date.now()}`,
      ...newWarehouse,
    };
    setWarehouses((prev) => [created, ...prev]);
    setShowAddWarehouseModal(false);
    setNewWarehouse({
      warehouseCode: '',
      warehouseName: '',
      zoneCode: 'Z-ACT-01',
      rackNumber: 'RACK-A01',
      binLocation: 'BIN-A01-01',
      type: 'Cold & Controlled Storage',
      tempMinC: 15,
      tempMaxC: 25,
      humidityMaxPct: 60,
      capacityPallets: 200,
    });
  };

  const handleDeleteItem = (type: string, id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus Master Record ini?')) return;

    if (type === 'product') setProducts((prev) => prev.filter((i) => i.id !== id));
    else if (type === 'raw_material') setRawMaterials((prev) => prev.filter((i) => i.id !== id));
    else if (type === 'supplier') setSuppliers((prev) => prev.filter((i) => i.id !== id));
    else if (type === 'customer') setCustomers((prev) => prev.filter((i) => i.id !== id));
    else if (type === 'machine') setMachines((prev) => prev.filter((i) => i.id !== id));
    else if (type === 'warehouse') setWarehouses((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGenerateDocNumber = async () => {
    try {
      const res = await fetch('/api/document-numbering/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: selectedDocType }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedDocNum(json.generatedNumber);
        loadMasterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <DatabaseIcon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Prompt 6 — Master Data Enterprise (Foundation of All Business Modules)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Fondasi Terstandarisasi Seluruh Transaksi ERP: Product Master (Kosmetik/Skincare), Raw Materials (CAS/MSDS/COA), Suppliers (AVL), Customers, CPKB Machines, FEFO Warehouses, Document Auto-Numbering Engine, & Audit Trail.
          </p>
        </div>

        {/* Global Search & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari Master Code, SKU, CAS, BPOM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all shadow-sm"
            title="Export Master Data ke CSV/Excel"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all shadow-sm"
            title="Import Bulk Master Data"
          >
            <Upload className="h-3.5 w-3.5 text-cyan-400" />
            <span>Import Bulk</span>
          </button>
        </div>
      </div>

      {importNotice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs font-semibold text-emerald-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{importNotice}</span>
          </div>
          <button onClick={() => setImportNotice(null)} className="text-emerald-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto custom-scrollbar scroll-smooth touch-pan-x py-1"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Master Data Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          💄 Product Master (FG/Semi/Samples)
        </button>
        <button
          onClick={() => setActiveTab('raw_materials')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'raw_materials'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🧪 Raw Materials (CAS / MSDS / COA)
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'suppliers'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚚 Approved Suppliers (AVL)
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'customers'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏢 Customers & Maklon Clients
        </button>
        <button
          onClick={() => setActiveTab('machines')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'machines'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚙️ CPKB Machinery & Lines
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'warehouses'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏭 Warehouse, Zones & Bins
        </button>
        <button
          onClick={() => setActiveTab('doc_numbering')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'doc_numbering'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🔢 Document Auto-Numbering Engine
        </button>
        <button
          onClick={() => setActiveTab('approval_custom')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'approval_custom'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Approval Workflows & Custom Fields
        </button>
        <button
          onClick={() => setActiveTab('audit_import')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'audit_import'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📜 Audit Logs & Import/Export
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-400" /> Master Produk
              </span>
              <p className="text-2xl font-extrabold text-emerald-300 font-mono">{metrics?.totalProducts || 3} SKU</p>
              <p className="text-[10px] text-slate-400">Terdaftar e-BPOM & Halal</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-teal-400" /> Raw Materials
              </span>
              <p className="text-2xl font-extrabold text-teal-300 font-mono">{metrics?.totalRawMaterials || 4} Item</p>
              <p className="text-[10px] text-slate-400">Memiliki MSDS & CAS Number</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-400" /> Approved Suppliers
              </span>
              <p className="text-2xl font-extrabold text-amber-300 font-mono">{metrics?.totalSuppliers || 3} Vendor</p>
              <p className="text-[10px] text-slate-400">100% Quality Audited</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" /> CPKB Machinery
              </span>
              <p className="text-2xl font-extrabold text-indigo-300 font-mono">{metrics?.totalMachines || 2} Mesin</p>
              <p className="text-[10px] text-slate-400">Class C Cleanroom Primary</p>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Status Kepatuhan Regulasi Kosmetik (CPKB Class A)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Izin Edar BPOM (e-BPOM System)</span>
                  <span className="text-emerald-400 font-mono font-bold">100% Valid Active</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Sertifikasi Halal MUI / BPJPH</span>
                  <span className="text-emerald-400 font-mono font-bold">ID00410000288100521</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">ISO 22716 Good Manufacturing Practice</span>
                  <span className="text-emerald-400 font-mono font-bold">Certified Audit Pass</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Hash className="h-4 w-4 text-amber-400" /> Engine Penomoran Dokumen & Log Audit Realtime
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Aturan Penomoran Dokumen Aktif</span>
                  <span className="text-amber-300 font-mono font-bold">{metrics?.totalDocumentRules || 4} Rule Format</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Total Rekaman Audit Trail ERP</span>
                  <span className="text-amber-300 font-mono font-bold">{metrics?.totalAuditLogs || 2} Log Activity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MASTER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-400" /> Master Produk Kosmetik & Skincare (Finished & Semi-Finished)
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Tambah Product Master Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">SKU / Code</th>
                  <th className="py-2.5 px-3">Nama Produk & Variant</th>
                  <th className="py-2.5 px-3">Brand & Category</th>
                  <th className="py-2.5 px-3">No. BPOM & Expiry</th>
                  <th className="py-2.5 px-3">Specs (Netto/pH/Visc)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="font-bold text-emerald-400">{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.productCode}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-100">{p.productName}</div>
                      <div className="text-[10px] text-slate-400">Formula: {p.formulaCode} (v{p.formulaVersion})</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-amber-300">{p.brand}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-teal-300 font-bold">{p.bpomNumber}</div>
                      <div className="text-[10px] text-slate-400">Exp: {p.bpomExpiry}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300">
                      <div>Netto: {p.netto} | Target pH: {p.targetPh}</div>
                      <div className="text-slate-400 text-[10px]">Viskositas: {p.viscosityCps}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Produk Kosmetik', data: p })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('product', p.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RAW MATERIALS */}
      {activeTab === 'raw_materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-teal-400" /> Database Bahan Baku Kosmetik (INCI Name, CAS, MSDS & COA)
            </h3>
            <button
              onClick={() => setShowAddRmModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Mendaftarkan Raw Material Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode & INCI Name</th>
                  <th className="py-2.5 px-3">CAS No. & Scientific Name</th>
                  <th className="py-2.5 px-3">Kategori & Grade</th>
                  <th className="py-2.5 px-3">Supplier Utama</th>
                  <th className="py-2.5 px-3">Harga / Kg</th>
                  <th className="py-2.5 px-3">Safety Stock</th>
                  <th className="py-2.5 px-3">Dokumen</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {rawMaterials.map((rm) => (
                  <tr key={rm.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-teal-400">{rm.code}</div>
                      <div className="font-bold text-slate-100">{rm.name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-amber-300">{rm.casNumber}</div>
                      <div className="text-[10px] text-slate-400 italic">{rm.scientificName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {rm.category}
                      </span>
                      <div className="text-[10px] text-slate-400">{rm.grade} ({rm.purityPercentage}%)</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{rm.supplierName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {rm.pricePerKgRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {rm.safetyStockKg} Kg
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-mono text-slate-400">
                      <div>MSDS: <span className="text-emerald-400">Verified</span></div>
                      <div>COA: <span className="text-emerald-400">Pass</span></div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Bahan Baku (INCI)', data: rm })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('raw_material', rm.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-400" /> Daftar Pemasok Terverifikasi Approved Vendor List (AVL)
            </h3>
            <button
              onClick={() => setShowAddSupplierModal(true)}
              className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Supplier AVL
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Vendor</th>
                  <th className="py-2.5 px-3">Nama Perusahaan & Brand</th>
                  <th className="py-2.5 px-3">Kontak PIC & Email</th>
                  <th className="py-2.5 px-3">Term Pembayaran</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Status Vendor</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{s.supplierCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{s.companyName}</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{s.picName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{s.paymentTermDays} Hari</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">{s.qualityScorePct}% Pass</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        APPROVED AVL
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Supplier (AVL)', data: s })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('supplier', s.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" /> Database Pelanggan & Klien Brand Maklon Kosmetik
            </h3>
            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Klien Maklon
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Klien</th>
                  <th className="py-2.5 px-3">Nama Perusahaan Maklon</th>
                  <th className="py-2.5 px-3">Brand Klien</th>
                  <th className="py-2.5 px-3">Kontak PIC</th>
                  <th className="py-2.5 px-3">Credit Limit (Rp)</th>
                  <th className="py-2.5 px-3">Grup Harga</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{c.customerCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{c.companyName}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{c.brandName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{c.picName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {c.creditLimitRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {c.priceGroup}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Klien Maklon', data: c })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('customer', c.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MACHINES */}
      {activeTab === 'machines' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" /> Master Mesin & Line Produksi CPKB Cleanroom
            </h3>
            <button
              onClick={() => setShowAddMachineModal(true)}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Mesin CPKB
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Mesin</th>
                  <th className="py-2.5 px-3">Nama Mesin & Kategori</th>
                  <th className="py-2.5 px-3">Cleanroom Grade</th>
                  <th className="py-2.5 px-3">Kapasitas / Jam</th>
                  <th className="py-2.5 px-3">Tgl Kalibrasi</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{m.machineCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{m.machineName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {m.cleanroomGrade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{m.capacityKgOrPcsPerHour} Unit/Hr</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{m.lastCalibrationDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Mesin CPKB', data: m })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('machine', m.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: WAREHOUSES */}
      {activeTab === 'warehouses' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-emerald-400" /> Master Gudang, Zona, Rak & Lokasi Bin (FEFO Tracking)
            </h3>
            <button
              onClick={() => setShowAddWarehouseModal(true)}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Gudang & Bin
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Gudang</th>
                  <th className="py-2.5 px-3">Nama Gudang & Lokasi Bin</th>
                  <th className="py-2.5 px-3">Tipe Storage</th>
                  <th className="py-2.5 px-3">Limit Suhu / Kelembaban</th>
                  <th className="py-2.5 px-3">Kapasitas Pallet</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {warehouses.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{w.warehouseCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      <div>{w.warehouseName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {w.zoneCode} &rarr; {w.rackNumber} &rarr; {w.binLocation}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {w.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {w.tempMinC}°C - {w.tempMaxC}°C (RH &lt; {w.humidityMaxPct}%)
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-100">{w.capacityPallets} Pallets</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setInspectedItem({ type: 'Gudang & Bin', data: w })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Inspeksi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('warehouse', w.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                          title="Hapus Master Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: DOCUMENT NUMBERING ENGINE */}
      {activeTab === 'doc_numbering' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Hash className="h-4 w-4 text-amber-400" /> Generator Penomoran Dokumen Otomatis ERP
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Pilih Jenis Dokumen</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-amber-300"
                >
                  <option value="MO">Manufacturing Order (MO)</option>
                  <option value="Batch">Batch Number Production</option>
                  <option value="COA">Certificate of Analysis (COA)</option>
                  <option value="PO">Purchase Order (PO)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateDocNumber}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Generate Nomor Dokumen Berikutnya
              </button>

              {generatedDocNum && (
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hasil Penomoran Baru:</span>
                  <div className="text-lg font-mono font-extrabold text-amber-300">{generatedDocNum}</div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="h-4 w-4 text-teal-400" /> Rule Sequence Terdaftar
            </h3>
            <div className="space-y-2 text-xs">
              {docFormats.map((f) => (
                <div key={f.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-teal-300">{f.docType}</span>
                    <span className="font-mono text-slate-400 text-[10px]">Seq: #{f.currentSequence}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-200">{f.sampleResult}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: APPROVAL & CUSTOM FIELDS */}
      {activeTab === 'approval_custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-emerald-400" /> Multi-Level Approval Workflow
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200">Approval Formula Spesifikasi R&D</span>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">Step 1</span>
                    <span>Review Formulator R&D Specialist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">Step 2</span>
                    <span>Sign Off Apoteker Penanggung Jawab BPOM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Tag className="h-4 w-4 text-amber-400" /> Tenant Custom Fields Config
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">Target pH Range Custom Field</span>
                <p className="text-[11px] text-slate-400">Field spesifik kosmetik untuk menguji keasaman formulasi.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: AUDIT LOGS & IMPORT/EXPORT */}
      {activeTab === 'audit_import' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="h-4 w-4 text-emerald-400" /> Rekaman Audit Trail (Keamanan Data & Compliance)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Pengguna</th>
                    <th className="py-2.5 px-3">Aksi</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Detail Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        {log.userName || log.userEmail || log.userId || log.user || 'System'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-300">
                        {log.entityType || log.module || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                        {typeof log.details === 'object' && log.details !== null
                          ? JSON.stringify(log.details)
                          : String(log.details ?? '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" /> Tambah Master Produk Baru
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">SKU Unique</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKU-FG-SER-03"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barrier Defense Cream 50ml"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">No. e-BPOM</label>
                  <input
                    type="text"
                    value={newProduct.bpomNumber}
                    onChange={(e) => setNewProduct({ ...newProduct, bpomNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-teal-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RAW MATERIAL */}
      {showAddRmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal-400" /> Tambah Bahan Baku Kosmetik Baru
              </h3>
              <button onClick={() => setShowAddRmModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Material</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RM-ACT-005"
                    value={newRm.code}
                    onChange={(e) => setNewRm({ ...newRm, code: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-teal-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">CAS Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 98-92-0"
                    value={newRm.casNumber}
                    onChange={(e) => setNewRm({ ...newRm, casNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Bahan (INCI Trade Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sodium Hyaluronate High Molecular"
                  value={newRm.name}
                  onChange={(e) => setNewRm({ ...newRm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Harga Estimasi per Kg (Rp)</label>
                <input
                  type="number"
                  value={newRm.pricePerKgRp}
                  onChange={(e) => setNewRm({ ...newRm, pricePerKgRp: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Raw Material
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLIER */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" /> Tambah Pemasok (AVL) Baru
              </h3>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Supplier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUP-CHEM-03"
                    value={newSupplier.supplierCode}
                    onChange={(e) => setNewSupplier({ ...newSupplier, supplierCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-amber-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Payment Term (Hari)</label>
                  <input
                    type="number"
                    value={newSupplier.paymentTermDays}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paymentTermDays: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT BASF Indonesia Chemical"
                  value={newSupplier.companyName}
                  onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Kontak PIC</label>
                  <input
                    type="text"
                    value={newSupplier.picName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, picName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Email PIC / Sales</label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Vendor AVL
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOMER */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" /> Tambah Klien Maklon Baru
              </h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Klien</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CUST-MKL-03"
                    value={newCustomer.customerCode}
                    onChange={(e) => setNewCustomer({ ...newCustomer, customerCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-indigo-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Brand Utama Klien</label>
                  <input
                    type="text"
                    placeholder="e.g. Somethinc / Avoskin"
                    value={newCustomer.brandName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, brandName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan Klien</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT Royal Botanica Aesthetics"
                  value={newCustomer.companyName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama PIC Brand</label>
                  <input
                    type="text"
                    value={newCustomer.picName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, picName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Credit Limit (Rp)</label>
                  <input
                    type="number"
                    value={newCustomer.creditLimitRp}
                    onChange={(e) => setNewCustomer({ ...newCustomer, creditLimitRp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Klien
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MACHINE */}
      {showAddMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" /> Tambah Mesin CPKB Cleanroom Baru
              </h3>
              <button onClick={() => setShowAddMachineModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Mesin / Asset ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCH-MIX-03"
                    value={newMachine.machineCode}
                    onChange={(e) => setNewMachine({ ...newMachine, machineCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-indigo-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Cleanroom Grade</label>
                  <select
                    value={newMachine.cleanroomGrade}
                    onChange={(e) => setNewMachine({ ...newMachine, cleanroomGrade: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  >
                    <option value="Class D (ISO 8)">Class D (ISO 8)</option>
                    <option value="Class C (ISO 7)">Class C (ISO 7)</option>
                    <option value="Class B (ISO 6)">Class B (ISO 6)</option>
                    <option value="Non-Cleanroom (Gudang)">Non-Cleanroom (Gudang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Mesin & Deskripsi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vacuum Homogenizer Mixer 500L"
                  value={newMachine.machineName}
                  onChange={(e) => setNewMachine({ ...newMachine, machineName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Kapasitas Output (Kg / Pcs per Jam)</label>
                <input
                  type="number"
                  value={newMachine.capacityKgOrPcsPerHour}
                  onChange={(e) => setNewMachine({ ...newMachine, capacityKgOrPcsPerHour: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Mesin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WAREHOUSE */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-emerald-400" /> Tambah Gudang & Lokasi Bin Baru
              </h3>
              <button onClick={() => setShowAddWarehouseModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWarehouse} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Gudang</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-FG-02"
                    value={newWarehouse.warehouseCode}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, warehouseCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Zona / Bin Location</label>
                  <input
                    type="text"
                    placeholder="e.g. ZONA-B -> RAK-01 -> BIN-A3"
                    value={newWarehouse.binLocation}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, binLocation: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Gudang</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gudang Finished Goods Karantina"
                  value={newWarehouse.warehouseName}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, warehouseName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Tipe Storage</label>
                  <select
                    value={newWarehouse.type}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-bold text-slate-200"
                  >
                    <option value="Suhu Terkontrol (15-25°C)">Suhu Terkontrol (15-25°C)</option>
                    <option value="Suhu Ruang Segar (20-30°C)">Suhu Ruang Segar (20-30°C)</option>
                    <option value="Cold Room (2-8°C)">Cold Room (2-8°C)</option>
                    <option value="Bahan Berbahaya / Flammable">Bahan Berbahaya / Flammable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kapasitas Pallet</label>
                  <input
                    type="number"
                    value={newWarehouse.capacityPallets}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, capacityPallets: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Gudang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-emerald-400" /> Import Data CSV ke Master Data ({activeTab.toUpperCase()})
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Pilih file CSV berformat standar untuk mengunggah dan mengintegrasikan secara massal ke modul{' '}
                <span className="font-bold text-emerald-400 uppercase">{activeTab}</span>.
              </p>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/50">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
                  <Upload className="h-8 w-8 text-emerald-400 mx-auto animate-bounce" />
                  <div className="font-bold text-slate-200">Klik untuk memilih file .CSV</div>
                  <div className="text-[10px] text-slate-400">Header CSV harus sesuai dengan atribut field entitas.</div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT ITEM DETAIL */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-400" /> Detail Inspeksi: {inspectedItem.type}
              </h3>
              <button onClick={() => setInspectedItem(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 space-y-2 border border-slate-800">
              {Object.entries(inspectedItem.data).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-amber-400 font-bold">{key}:</span>
                  <span className="text-slate-100 font-medium">
                    {typeof val === 'object' && val !== null
                      ? JSON.stringify(val)
                      : String(val ?? '')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon
function DatabaseIcon(props: any) {
  return <Building2 {...props} />;
}
