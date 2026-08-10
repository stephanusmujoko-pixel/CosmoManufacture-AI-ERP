// CRM & Sales Management Enterprise Data Layer
// Integrated with Master Data (Customers, Products, Price Lists)

export interface Lead {
  id: string;
  leadNumber: string;
  leadSource: 'Website Inquiry' | 'Cosmetic Expo / Exhibition' | 'Instagram DM' | 'Direct Referral' | 'Cold Outreach' | 'WhatsApp Business';
  industry: 'Beauty & Skincare' | 'Dermatology Clinic' | 'E-commerce Brand' | 'Retail / Pharmacy Chain' | 'Personal Care OEM';
  companyName: string;
  picName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  province: string;
  city: string;
  potentialValueRp: number;
  probabilityPct: number;
  stage: 'New Lead' | 'Qualified' | 'Presentation' | 'Sample Requested' | 'Quotation' | 'Negotiation' | 'Purchase Order' | 'Won' | 'Lost';
  assignedSalesperson: string;
  nextFollowUpDate: string;
  priority: 'High' | 'Medium' | 'Low';
  score: number; // 0-100 Lead AI Score
  notes: string;
  createdDate: string;
}

export interface QuotationItem {
  id: string;
  productSku: string;
  productName: string;
  quantityUnit: number;
  unitPriceRp: number;
  discountPct: number;
  subtotalRp: number;
  packagingSpec: string;
  targetBpom: string;
}

export interface SalesQuotation {
  id: string;
  quotationNumber: string;
  version: string;
  leadId?: string;
  customerId: string;
  customerName: string;
  customerPic: string;
  customerEmail: string;
  salespersonName: string;
  validUntil: string;
  paymentTermDays: number;
  items: QuotationItem[];
  subtotalRp: number;
  discountTotalRp: number;
  taxPpnRp: number; // 11%
  grandTotalRp: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Sent to Client' | 'Accepted' | 'Rejected' | 'Converted to SO';
  approvalFlow: {
    step: string;
    approverRole: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    date?: string;
  }[];
  createdDate: string;
}

export interface SalesOrderItem {
  id: string;
  productSku: string;
  productName: string;
  quantityOrdered: number;
  quantityDelivered: number;
  unitPriceRp: number;
  subtotalRp: number;
}

export interface SalesOrder {
  id: string;
  soNumber: string;
  quotationNumber?: string;
  customerId: string;
  customerName: string;
  brandName: string;
  deliveryAddress: string;
  warehouseCode: string;
  salespersonName: string;
  paymentTermDays: number;
  shippingMethod: 'Express Trucking' | 'Self Pick-up' | 'Container FCL 20ft' | 'Cold Chain Delivery';
  items: SalesOrderItem[];
  subtotalRp: number;
  taxPpnRp: number;
  grandTotalRp: number;
  status: 'Draft' | 'Confirmed' | 'Approved' | 'In Production' | 'Ready to Deliver' | 'Partially Shipped' | 'Fully Shipped' | 'Completed' | 'Cancelled';
  createdDate: string;
  targetDeliveryDate: string;
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  soNumber: string;
  customerName: string;
  shippingAddress: string;
  courierName: string;
  trackingNumber: string;
  driverName: string;
  vehiclePlateNumber: string;
  dispatchDate: string;
  estimatedArrival: string;
  status: 'Picking' | 'Packed' | 'In Transit' | 'Delivered' | 'Returned';
  proofOfDeliveryUrl?: string;
}

export interface CustomerActivity {
  id: string;
  entityId: string; // lead or customer
  entityName: string;
  type: 'Meeting' | 'Visit' | 'Phone Call' | 'Email' | 'WhatsApp' | 'Sample Dispatch';
  title: string;
  summary: string;
  activityDate: string;
  salespersonName: string;
  outcome: 'Positive' | 'Follow-up Needed' | 'Closing Scheduled' | 'Lost Opportunity';
}

export interface SampleRequest {
  id: string;
  sampleNumber: string;
  leadId?: string;
  customerName: string;
  brandName: string;
  formulaName: string;
  labBatchNumber: string;
  scentNote: string;
  textureSpec: string;
  feedbackStatus: 'Pending Review' | 'Revision Requested' | 'Approved for Production' | 'Rejected';
  revisionNotes?: string;
  dispatchDate: string;
  salespersonName: string;
}

export interface BpomHalalAssistance {
  id: string;
  customerName: string;
  brandName: string;
  productName: string;
  targetBpomCategory: string;
  bpomSubmissionStatus: 'Dokumen Disiapkan' | 'Uji Lab Stabilitas & Mikrobiologi' | 'Drafting e-Registration BPOM' | 'Izin Edar BPOM Terbit (NA)' | 'Sertifikat Halal LPPOM MUI Terbit';
  naNumber?: string;
  halalRegNumber?: string;
  estimatedTargetDate: string;
}

// Seed Data
export const dbSampleRequests: SampleRequest[] = [
  {
    id: 'samp-001',
    sampleNumber: 'SAMP/RD/2026/08/001',
    leadId: 'lead-001',
    customerName: 'GlowNation Skincare Inc.',
    brandName: 'GlowNation',
    formulaName: 'Niacinamide 10% + Ceramide 3x Hydrating Gel Serum',
    labBatchNumber: 'BATCH-LAB-8819',
    scentNote: 'Mild Rose Water & Camellia Essence',
    textureSpec: 'Watery Gel Gelatinous - Fast Absorb',
    feedbackStatus: 'Approved for Production',
    revisionNotes: 'Tekstur & aroma sangat disukai tim brand owner.',
    dispatchDate: '2026-08-04',
    salespersonName: 'Dimas Anggara',
  },
  {
    id: 'samp-002',
    sampleNumber: 'SAMP/RD/2026/08/002',
    leadId: 'lead-002',
    customerName: 'Klinik Estetika DermaGlow',
    brandName: 'DermaGlow Pro',
    formulaName: 'Acne Spot Treatment Gel Salicylic Acid 2% + Cica 5%',
    labBatchNumber: 'BATCH-LAB-8822',
    scentNote: 'Unfragranced (Hypoallergenic)',
    textureSpec: 'Translucent Cooling Gel',
    feedbackStatus: 'Revision Requested',
    revisionNotes: 'Tingkatkan sedikit efek cooling & sensasi tidak lengket di kulit sensitif.',
    dispatchDate: '2026-08-05',
    salespersonName: 'Siti Nurhaliza',
  },
];

export const dbBpomAssistance: BpomHalalAssistance[] = [
  {
    id: 'bpom-001',
    customerName: 'PT Beauty Glow Indonesia',
    brandName: 'BeautyGlow Cosmetics',
    productName: 'Luminance Glow Serum 30ml',
    targetBpomCategory: 'NA - Kosmetik Serum & Essence',
    bpomSubmissionStatus: 'Izin Edar BPOM Terbit (NA)',
    naNumber: 'NA18240199882',
    halalRegNumber: 'ID31210001889920124',
    estimatedTargetDate: '2026-08-01',
  },
  {
    id: 'bpom-002',
    customerName: 'GlowNation Skincare Inc.',
    brandName: 'GlowNation',
    productName: 'Brightening Niacinamide Gel Cream',
    targetBpomCategory: 'NA - Kosmetik Pelembab Wajah',
    bpomSubmissionStatus: 'Uji Lab Stabilitas & Mikrobiologi',
    estimatedTargetDate: '2026-09-15',
  },
];

// Seed Data
export const dbLeads: Lead[] = [
  {
    id: 'lead-001',
    leadNumber: 'LD-2026-0012',
    leadSource: 'Cosmetic Expo / Exhibition',
    industry: 'Beauty & Skincare',
    companyName: 'GlowNation Skincare Inc.',
    picName: 'Clarissa Valerie (Brand Owner)',
    email: 'clarissa@glownation.co.id',
    phone: '+62 812 9000 8811',
    whatsapp: '+62 812 9000 8811',
    address: 'Kuningan City Tower 12th Fl, Jakarta Selatan',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    potentialValueRp: 450000000,
    probabilityPct: 80,
    stage: 'Quotation',
    assignedSalesperson: 'Dimas Anggara (Senior Account Executive)',
    nextFollowUpDate: '2026-08-10',
    priority: 'High',
    score: 88,
    notes: 'Ingin maklon 20,000 pcs Brightening Serum Niacinamide + Ceramide Gel dengan custom packaging airless pump.',
    createdDate: '2026-08-01',
  },
  {
    id: 'lead-002',
    leadNumber: 'LD-2026-0013',
    leadSource: 'Instagram DM',
    industry: 'Dermatology Clinic',
    companyName: 'Klinik Estetika DermaGlow',
    picName: 'dr. Andi Wijaya, Sp.D.V.E',
    email: 'dr.andi@dermaglowclinic.com',
    phone: '+62 811 4455 6677',
    whatsapp: '+62 811 4455 6677',
    address: 'Jl. Boulevard Barat Raya LC-6 No. 8, Kelapa Gading',
    province: 'DKI Jakarta',
    city: 'Jakarta Utara',
    potentialValueRp: 280000000,
    probabilityPct: 60,
    stage: 'Sample Requested',
    assignedSalesperson: 'Siti Nurhaliza (Account Executive)',
    nextFollowUpDate: '2026-08-12',
    priority: 'High',
    score: 75,
    notes: 'Minta sampel formulasi acne spot treatment salicylic acid 2% & soothing cica gel.',
    createdDate: '2026-08-03',
  },
  {
    id: 'lead-003',
    leadNumber: 'LD-2026-0014',
    leadSource: 'Website Inquiry',
    industry: 'E-commerce Brand',
    companyName: 'PureBotanica Organics',
    picName: 'Reza Rahadian (Operations Director)',
    email: 'reza@purebotanica.id',
    phone: '+62 815 9988 2233',
    whatsapp: '+62 815 9988 2233',
    address: 'Jl. Riau No. 102, Bandung',
    province: 'Jawa Barat',
    city: 'Bandung',
    potentialValueRp: 150000000,
    probabilityPct: 40,
    stage: 'Presentation',
    assignedSalesperson: 'Dimas Anggara (Senior Account Executive)',
    nextFollowUpDate: '2026-08-15',
    priority: 'Medium',
    score: 62,
    notes: 'Diskusi awal formulasi vegan organic body lotion beraroma lavender chamomile.',
    createdDate: '2026-08-05',
  },
];

export const dbQuotations: SalesQuotation[] = [
  {
    id: 'quo-001',
    quotationNumber: 'QUO/SALES/2026/08/001',
    version: '1.0',
    leadId: 'lead-001',
    customerId: 'cust-001',
    customerName: 'PT Beauty Glow Indonesia',
    customerPic: 'Rina Kartika (CEO)',
    customerEmail: 'rina@beautyglow.co.id',
    salespersonName: 'Dimas Anggara (Senior Account Executive)',
    validUntil: '2026-08-31',
    paymentTermDays: 30,
    items: [
      {
        id: 'qitem-01',
        productSku: 'SKU-FG-LUM-01',
        productName: 'Luminance Glow Serum 30ml (Niacinamide 10% + Alpha Arbutin 2%)',
        quantityUnit: 10000,
        unitPriceRp: 32000,
        discountPct: 5.0,
        subtotalRp: 304000000,
        packagingSpec: 'Dropper Bottle Amber Glass 30ml Custom Gold Print',
        targetBpom: 'NA18240199882',
      },
      {
        id: 'qitem-02',
        productSku: 'SKU-FG-BAR-02',
        productName: 'Ceramide Barrier Defense Moisture Gel 50ml',
        quantityUnit: 5000,
        unitPriceRp: 45000,
        discountPct: 5.0,
        subtotalRp: 213750000,
        packagingSpec: 'Airless Pump Jar 50ml Soft Pink Matte',
        targetBpom: 'NA18240199991',
      },
    ],
    subtotalRp: 517750000,
    discountTotalRp: 27250000,
    taxPpnRp: 56952500, // 11%
    grandTotalRp: 574702500,
    status: 'Approved',
    approvalFlow: [
      { step: 'Review Price List', approverRole: 'Sales Manager', status: 'Approved', approvedBy: 'Dimas Anggara', date: '2026-08-02' },
      { step: 'Margin Sign-off', approverRole: 'Finance Director', status: 'Approved', approvedBy: 'Budi Rahardjo', date: '2026-08-02' },
    ],
    createdDate: '2026-08-02',
  },
];

export const dbSalesOrders: SalesOrder[] = [
  {
    id: 'so-001',
    soNumber: 'SO/CPKB/2026/08/0088',
    quotationNumber: 'QUO/SALES/2026/08/001',
    customerId: 'cust-001',
    customerName: 'PT Beauty Glow Indonesia',
    brandName: 'BeautyGlow Cosmetics',
    deliveryAddress: 'Gudang Utama BeautyGlow, Pergudangan Taman Tekno Blok D/5, BSD City',
    warehouseCode: 'WH-FG-02',
    salespersonName: 'Dimas Anggara',
    paymentTermDays: 30,
    shippingMethod: 'Express Trucking',
    items: [
      {
        id: 'soitem-01',
        productSku: 'SKU-FG-LUM-01',
        productName: 'Luminance Glow Serum 30ml',
        quantityOrdered: 10000,
        quantityDelivered: 4000,
        unitPriceRp: 30400,
        subtotalRp: 304000000,
      },
      {
        id: 'soitem-02',
        productSku: 'SKU-FG-BAR-02',
        productName: 'Ceramide Barrier Defense Moisture Gel 50ml',
        quantityOrdered: 5000,
        quantityDelivered: 5000,
        unitPriceRp: 42750,
        subtotalRp: 213750000,
      },
    ],
    subtotalRp: 517750000,
    taxPpnRp: 56952500,
    grandTotalRp: 574702500,
    status: 'Partially Shipped',
    createdDate: '2026-08-03',
    targetDeliveryDate: '2026-08-20',
  },
];

export const dbDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'do-001',
    doNumber: 'DO/LOG/2026/08/0102',
    soNumber: 'SO/CPKB/2026/08/0088',
    customerName: 'PT Beauty Glow Indonesia',
    shippingAddress: 'Gudang Utama BeautyGlow, Pergudangan Taman Tekno Blok D/5, BSD City',
    courierName: 'Internal Logistics Cold Truck #03',
    trackingNumber: 'TRK-PARAGONIA-2026-8819',
    driverName: 'Suryadi (SIM B2 Umum)',
    vehiclePlateNumber: 'B 9182 PQA',
    dispatchDate: '2026-08-05 09:00',
    estimatedArrival: '2026-08-05 13:00',
    status: 'Delivered',
    proofOfDeliveryUrl: 'POD_Signed_BeautyGlow_BSD.pdf',
  },
];

export const dbActivities: CustomerActivity[] = [
  {
    id: 'act-001',
    entityId: 'lead-001',
    entityName: 'GlowNation Skincare Inc.',
    type: 'Meeting',
    title: 'Presentasi Formulasi Sampel Serum & Ceramide Gel',
    summary: 'Klien sangat puas dengan tekstur dan warna serum. Meminta penawaran resmi untuk 10k batch pertama.',
    activityDate: '2026-08-02 14:00',
    salespersonName: 'Dimas Anggara',
    outcome: 'Positive',
  },
  {
    id: 'act-002',
    entityId: 'lead-002',
    entityName: 'Klinik Estetika DermaGlow',
    type: 'Sample Dispatch',
    title: 'Pengiriman Sampel Lab Batch #SAMP-991',
    summary: 'Sampel dikirimkan via Kurir Ekspres. Menunggu ulasan hasil tes sensitivitas dari tim dokter klinik.',
    activityDate: '2026-08-04 11:30',
    salespersonName: 'Siti Nurhaliza',
    outcome: 'Follow-up Needed',
  },
];
