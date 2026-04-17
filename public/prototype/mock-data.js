/* global window */
// Mock data for Cellgenic Operations Platform

window.COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', city: 'Miami', x: 240, y: 195, currency: 'USD' },
  { code: 'MX', name: 'Mexico',        flag: '🇲🇽', city: 'Guadalajara', x: 210, y: 255, currency: 'MXN' },
  { code: 'CO', name: 'Colombia',      flag: '🇨🇴', city: 'Bogotá', x: 275, y: 335, currency: 'COP' },
  { code: 'AR', name: 'Argentina',     flag: '🇦🇷', city: 'Buenos Aires', x: 335, y: 445, currency: 'ARS' },
  { code: 'ES', name: 'Spain',         flag: '🇪🇸', city: 'Madrid',  x: 500, y: 175, currency: 'EUR' },
];

window.KPI = {
  US: { skus: 142, lowStock: 4, pendingIn: 2, mtdRev: 124800, vials: 1840, deltaRev: 12.4 },
  MX: { skus: 128, lowStock: 7, pendingIn: 3, mtdRev:  48200, vials: 1120, deltaRev: -3.1 },
  CO: { skus:  96, lowStock: 2, pendingIn: 1, mtdRev:  22400, vials:  640, deltaRev:  8.9 },
  AR: { skus: 104, lowStock: 3, pendingIn: 2, mtdRev:  31100, vials:  820, deltaRev:  2.2 },
  ES: { skus: 116, lowStock: 1, pendingIn: 0, mtdRev:  67900, vials:  980, deltaRev:  6.8 },
  ALL:{ skus: 586, lowStock:17, pendingIn: 8, mtdRev: 294400, vials: 5400, deltaRev:  7.1 },
};

window.PRODUCTS = [
  { sku: 'CG-UMSC-C20', name: 'UC-MSC, Cryopreserved', category: 'Cellular', unit: 'vial', cells: '2.1×10⁶' },
  { sku: 'CG-EXO-MSC',  name: 'MSC-Derived Exosomes',  category: 'Exosomes', unit: 'vial', cells: '5×10¹¹' },
  { sku: 'CG-PEP-BPC',  name: 'BPC-157 Peptide',       category: 'Peptide',  unit: 'vial', cells: '10 mg' },
  { sku: 'CG-PEP-TB4',  name: 'Thymosin Beta-4',       category: 'Peptide',  unit: 'vial', cells: '5 mg'  },
  { sku: 'CG-AMSC-C15', name: 'AD-MSC, Cryopreserved', category: 'Cellular', unit: 'vial', cells: '1.5×10⁶' },
  { sku: 'CG-HRM-TST',  name: 'Testosterone Cypionate',category: 'Hormone',  unit: 'vial', cells: '200 mg/mL' },
];

window.STOCK = [
  // sku, US, MX, CO, AR, ES
  { sku: 'CG-UMSC-C20', name: 'UC-MSC, Cryopreserved',   US: 84, MX: 22, CO: 14, AR: 30, ES: 48 },
  { sku: 'CG-EXO-MSC',  name: 'MSC-Derived Exosomes',    US: 52, MX:  8, CO: 22, AR: 14, ES: 30 },
  { sku: 'CG-PEP-BPC',  name: 'BPC-157 Peptide',         US:120, MX: 48, CO: 60, AR: 72, ES: 96 },
  { sku: 'CG-PEP-TB4',  name: 'Thymosin Beta-4',         US: 68, MX:  3, CO: 40, AR: 55, ES: 80 },
  { sku: 'CG-AMSC-C15', name: 'AD-MSC, Cryopreserved',   US: 46, MX: 18, CO: 12, AR: 24, ES: 36 },
  { sku: 'CG-HRM-TST',  name: 'Testosterone Cypionate',  US:210, MX:120, CO: 88, AR:156, ES:180 },
];

window.LOW_STOCK_THRESHOLD = { 'CG-UMSC-C20':20, 'CG-EXO-MSC':15, 'CG-PEP-BPC':40, 'CG-PEP-TB4':10, 'CG-AMSC-C15':15, 'CG-HRM-TST':80 };

window.TRANSFERS = [
  { id: 'TRF-00421', from: 'US', to: 'MX', sku: 'CG-PEP-TB4',  product: 'Thymosin Beta-4',       qty: 30, status: 'pending',  urgent: true,  created: '04/16 · 09:42', note: 'MX running critical — clinic orders backed up' },
  { id: 'TRF-00420', from: 'ES', to: 'CO', sku: 'CG-UMSC-C20', product: 'UC-MSC, Cryopreserved', qty: 12, status: 'pending',  urgent: false, created: '04/15 · 14:18', note: 'Regular replenishment' },
  { id: 'TRF-00419', from: 'US', to: 'AR', sku: 'CG-EXO-MSC',  product: 'MSC-Derived Exosomes',  qty:  8, status: 'transit',  urgent: true,  created: '04/14 · 11:05', note: 'Dr. Molina patient cohort — overnight dry ice' },
  { id: 'TRF-00418', from: 'MX', to: 'US', sku: 'CG-PEP-BPC',  product: 'BPC-157 Peptide',       qty: 40, status: 'transit',  urgent: false, created: '04/13 · 16:30', note: '' },
  { id: 'TRF-00417', from: 'US', to: 'ES', sku: 'CG-AMSC-C15', product: 'AD-MSC, Cryopreserved', qty: 10, status: 'received', urgent: false, created: '04/09 · 08:12', note: '' },
  { id: 'TRF-00416', from: 'CO', to: 'MX', sku: 'CG-HRM-TST',  product: 'Testosterone Cypionate',qty: 60, status: 'received', urgent: false, created: '04/07 · 10:50', note: '' },
];

window.ACTIVITY = [
  { time: '09:42', country: 'MX', type: 'transfer.urgent', text: 'Urgent transfer TRF-00421 requested from US — Thymosin Beta-4 · 30 vials', tone: 'danger' },
  { time: '09:31', country: 'MX', type: 'stock.alert',     text: 'Low stock — Thymosin Beta-4 at 3 vials (threshold 10)', tone: 'danger' },
  { time: '08:55', country: 'ES', type: 'sync.ok',         text: 'Katana sync completed — 142 SKUs updated', tone: 'neutral' },
  { time: '08:40', country: 'US', type: 'transfer.received',text:'TRF-00416 marked received · 60 vials reconciled', tone: 'success' },
  { time: '08:12', country: 'CO', type: 'stock.alert',     text: 'Low stock — MSC-Derived Exosomes at 22 vials (threshold 15)', tone: 'warning' },
  { time: '07:58', country: 'AR', type: 'sync.fail',       text: 'QuickBooks sync failed — token refresh required', tone: 'danger' },
  { time: '07:33', country: 'US', type: 'order.created',   text: 'New invoice INV-20418 · Revive Clinic · $8,420', tone: 'neutral' },
  { time: '07:14', country: 'ES', type: 'transfer.requested',text:'TRF-00420 requested to CO · UC-MSC · 12 vials', tone: 'info' },
  { time: '06:42', country: 'MX', type: 'order.created',   text: 'New sales receipt · Clinica Vida · MX$ 42,800', tone: 'neutral' },
];

window.INTEGRATIONS = [
  { name: 'Katana MRP',       status: 'ok',   lastSync: '12 min ago', cadence: '15 min cron' },
  { name: 'QuickBooks US',    status: 'ok',   lastSync: '28 min ago', cadence: '30 min' },
  { name: 'QuickBooks MX',    status: 'ok',   lastSync: '29 min ago', cadence: '30 min' },
  { name: 'QuickBooks CO',    status: 'ok',   lastSync: '27 min ago', cadence: '30 min' },
  { name: 'QuickBooks AR',    status: 'fail', lastSync: '3 hr ago',   cadence: 'token expiring' },
  { name: 'QuickBooks ES',    status: 'ok',   lastSync: '26 min ago', cadence: '30 min' },
  { name: 'Resend email',     status: 'ok',   lastSync: 'live',       cadence: 'webhook' },
];

window.USERS = [
  { id: 'u_global', name: 'Laura Benítez', role: 'global_admin', country: null,  initials: 'LB' },
  { id: 'u_mx',     name: 'Diego Morales', role: 'country_admin', country: 'MX', initials: 'DM' },
  { id: 'u_us',     name: 'Sarah Reyes',   role: 'country_admin', country: 'US', initials: 'SR' },
];

window.REPORT_SECTIONS = {
  low_stock: {
    title: 'Low stock',
    summary: 'Seven SKUs across MX and CO are below threshold. Thymosin Beta-4 in MX is critical (3 vials, runway < 5 days at current velocity).',
    items: [
      { label: 'Thymosin Beta-4 · MX',      value: '3 vials',  tone: 'danger',  meta: 'Runway < 5 days' },
      { label: 'MSC-Exosomes · CO',         value: '22 vials', tone: 'warning', meta: 'Runway 11 days' },
      { label: 'UC-MSC · AR',               value: '30 vials', tone: 'warning', meta: 'Runway 14 days' },
    ],
  },
  top_sellers: {
    title: 'Top sellers — MTD',
    summary: 'US revenue pacing +12% over March. BPC-157 remains the volume leader across all regions; cellular products drive margin in ES.',
    items: [
      { label: 'BPC-157 Peptide',          value: '$62.1K', tone: 'success', meta: '408 vials · 5 regions' },
      { label: 'UC-MSC, Cryopreserved',    value: '$84.0K', tone: 'success', meta: '98 vials · premium tier' },
      { label: 'Testosterone Cypionate',   value: '$48.6K', tone: 'neutral', meta: 'Hormone category' },
    ],
  },
  sync_status: {
    title: 'Integration health',
    summary: 'QuickBooks AR token has expired and needs manual rotation. All Katana syncs nominal. Webhook queue empty.',
    items: [
      { label: 'Katana MRP',       value: 'Healthy', tone: 'success', meta: '15 min cadence · 100% success rate 7d' },
      { label: 'QuickBooks AR',    value: 'Down',    tone: 'danger',  meta: 'Token expired · rotate in Settings → Integrations' },
      { label: 'Webhook backlog',  value: '0',       tone: 'success', meta: 'No pending events' },
    ],
  },
  recommendations: {
    title: 'Recommendations',
    summary: 'Two transfers can resolve the MX shortage within 48h. Consider raising BPC-157 threshold in CO given 30-day demand trend.',
    items: [
      { label: 'Transfer 30 vials TB-4 from US → MX',  value: 'High priority', tone: 'danger',  meta: 'Approve TRF-00421' },
      { label: 'Raise BPC-157 threshold to 80 in CO',  value: 'Medium',        tone: 'warning', meta: 'Current 60 breached twice in 30d' },
      { label: 'Rotate QuickBooks AR refresh token',   value: 'Blocking',      tone: 'danger',  meta: 'Revenue data stale' },
    ],
  },
};

window.PRODUCT_DETAIL = {
  sku: 'CG-UMSC-C20',
  name: 'UC-MSC, Cryopreserved',
  category: 'Cellular',
  cells: '2.1×10⁶ viable cells/vial',
  tissueSource: 'Umbilical cord — FDA-registered tissue bank',
  storage: '−150°C vapor-phase LN₂',
  regulatory: 'Section 361 HCT/P · Exempt from premarket approval',
  description: 'Cryopreserved umbilical-cord mesenchymal stem cells for allogeneic clinical use. Each lot is released against a full panel of viability, sterility, and endotoxin assays.',
  lots: [
    { lot: 'CG-26-0817', country: 'US', vials: 24, expires: '04/12/28', status: 'Released' },
    { lot: 'CG-26-0811', country: 'ES', vials: 18, expires: '03/28/28', status: 'Released' },
    { lot: 'CG-26-0802', country: 'MX', vials:  8, expires: '02/14/28', status: 'In transit' },
  ],
  docs: [
    { name: 'Certificate of Analysis — Lot CG-26-0817', type: 'COA',      size: '412 KB', uploaded: '04/12/26' },
    { name: 'Viability assay report',                    type: 'COA',      size: '186 KB', uploaded: '04/12/26' },
    { name: 'Cryopreservation & thawing protocol',       type: 'PROTOCOL', size: '224 KB', uploaded: '03/01/26' },
    { name: 'Sterility confirmation — Lot CG-26-0817',   type: 'COA',      size: '98 KB',  uploaded: '04/12/26' },
    { name: 'Product brochure (EN)',                     type: 'BROCHURE', size: '1.2 MB', uploaded: '02/14/26' },
  ],
};
