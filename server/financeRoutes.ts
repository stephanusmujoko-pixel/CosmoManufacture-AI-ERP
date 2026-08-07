import express, { Request, Response } from 'express';
import {
  initialCoa,
  initialJournalEntries,
  initialApInvoices,
  initialArInvoices,
  initialBankAccounts,
  initialPettyCash,
  initialCostCenterBudgets,
  initialProductCosting,
  initialCostVariances,
  initialFixedAssets,
  initialTaxes,
  initialClosingStatus,
  ChartOfAccount,
  JournalEntry,
  AccountsPayableInvoice,
  AccountsReceivableInvoice,
  BankAccount,
  PettyCashTransaction,
  CostCenterBudget,
  ProductCostingItem,
  FixedAssetItem,
  TaxTransaction,
} from './financeData.js';

export const financeRouter = express.Router();

// In-memory state for Finance Module
let coaList = [...initialCoa];
let journalEntries = [...initialJournalEntries];
let apInvoices = [...initialApInvoices];
let arInvoices = [...initialArInvoices];
let bankAccounts = [...initialBankAccounts];
let pettyCashTransactions = [...initialPettyCash];
let costCenterBudgets = [...initialCostCenterBudgets];
let productCostingList = [...initialProductCosting];
let costVariances = [...initialCostVariances];
let fixedAssets = [...initialFixedAssets];
let taxTransactions = [...initialTaxes];
let closingStatus = { ...initialClosingStatus };

// ==========================================
// 1. CHART OF ACCOUNTS (COA) API
// ==========================================
financeRouter.get('/finance/coa', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: coaList.length,
    data: coaList,
  });
});

financeRouter.post('/finance/coa', (req: Request, res: Response) => {
  const { code, name, category, subCategory, balanceType, costCenterCode } = req.body;

  if (!code || !name || !category) {
    return res.status(400).json({ error: 'Code, Name, and Category are required.' });
  }

  const existing = coaList.find((c) => c.code === code);
  if (existing) {
    return res.status(400).json({ error: `Account with code ${code} already exists.` });
  }

  const newCoa: ChartOfAccount = {
    id: `coa-${Date.now()}`,
    code,
    name,
    category,
    subCategory: subCategory || 'General',
    balanceType: balanceType || (category === 'Asset' || category === 'COGS' || category === 'Expense' ? 'Debit' : 'Credit'),
    balanceIdr: 0,
    costCenterCode,
    isActive: true,
    isHeader: false,
  };

  coaList.unshift(newCoa);
  res.status(201).json({ success: true, message: 'Chart of Account created successfully.', data: newCoa });
});

// ==========================================
// 2. GENERAL LEDGER & JOURNALS API
// ==========================================
financeRouter.get('/finance/journals', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: journalEntries.length,
    data: journalEntries,
  });
});

financeRouter.post('/finance/journals', (req: Request, res: Response) => {
  const { date, description, sourceModule, sourceReference, lines } = req.body;

  if (!lines || !Array.isArray(lines) || lines.length < 2) {
    return res.status(400).json({ error: 'At least 2 journal lines are required for double-entry bookkeeping.' });
  }

  // Calculate totals
  let totalDebit = 0;
  let totalCredit = 0;
  lines.forEach((line: any) => {
    totalDebit += Number(line.debitIdr || 0);
    totalCredit += Number(line.creditIdr || 0);
  });

  // Business Rule: Double entry balancing validation
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return res.status(400).json({
      error: `Journal is not balanced! Total Debit (IDR ${totalDebit.toLocaleString()}) must equal Total Credit (IDR ${totalCredit.toLocaleString()}).`,
    });
  }

  // Business Rule: Check period locking
  const period = (date || new Date().toISOString().substring(0, 10)).substring(0, 7);
  if (closingStatus.period === period && closingStatus.status === 'Hard Locked') {
    return res.status(403).json({
      error: `Period ${period} is Hard Locked. No new journal entries are allowed.`,
    });
  }

  const newJournal: JournalEntry = {
    id: `JE-${Date.now()}`,
    voucherNumber: `JV/${period.replace('-', '/')}/${String(journalEntries.length + 1).padStart(3, '0')}`,
    date: date || new Date().toISOString().substring(0, 10),
    period,
    sourceModule: sourceModule || 'Manual',
    sourceReference: sourceReference || 'JV-MANUAL',
    description: description || 'Manual Journal Voucher Entry',
    totalDebitIdr: totalDebit,
    totalCreditIdr: totalCredit,
    status: 'Posted',
    postedBy: 'Finance User (System)',
    postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lines: lines.map((l: any, idx: number) => ({
      id: `jl-new-${idx}`,
      accountCode: l.accountCode,
      accountName: l.accountName || coaList.find((c) => c.code === l.accountCode)?.name || 'Account',
      debitIdr: Number(l.debitIdr || 0),
      creditIdr: Number(l.creditIdr || 0),
      memo: l.memo || description,
      costCenterCode: l.costCenterCode,
    })),
  };

  // Update COA balances
  newJournal.lines.forEach((line) => {
    const acc = coaList.find((c) => c.code === line.accountCode);
    if (acc) {
      if (acc.balanceType === 'Debit') {
        acc.balanceIdr += line.debitIdr - line.creditIdr;
      } else {
        acc.balanceIdr += line.creditIdr - line.debitIdr;
      }
    }
  });

  journalEntries.unshift(newJournal);
  res.status(201).json({ success: true, message: 'Journal Entry posted successfully to General Ledger.', data: newJournal });
});

// ==========================================
// 3. ACCOUNTS PAYABLE (AP) & RECEIVABLE (AR) API
// ==========================================
financeRouter.get('/finance/ap', (req: Request, res: Response) => {
  const totalAp = apInvoices.reduce((acc, curr) => acc + curr.remainingAmountIdr, 0);
  res.json({
    success: true,
    totalRemainingApIdr: totalAp,
    data: apInvoices,
  });
});

financeRouter.get('/finance/ar', (req: Request, res: Response) => {
  const totalAr = arInvoices.reduce((acc, curr) => acc + curr.remainingAmountIdr, 0);
  res.json({
    success: true,
    totalRemainingArIdr: totalAr,
    data: arInvoices,
  });
});

financeRouter.get('/finance/ap/aging', (req: Request, res: Response) => {
  const agingSummary = {
    '0-30 Days': apInvoices.filter((i) => i.agingCategory === '0-30 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '31-60 Days': apInvoices.filter((i) => i.agingCategory === '31-60 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '61-90 Days': apInvoices.filter((i) => i.agingCategory === '61-90 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '90+ Days': apInvoices.filter((i) => i.agingCategory === '90+ Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
  };
  res.json({ success: true, data: agingSummary });
});

financeRouter.get('/finance/ar/aging', (req: Request, res: Response) => {
  const agingSummary = {
    '0-30 Days': arInvoices.filter((i) => i.agingCategory === '0-30 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '31-60 Days': arInvoices.filter((i) => i.agingCategory === '31-60 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '61-90 Days': arInvoices.filter((i) => i.agingCategory === '61-90 Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
    '90+ Days': arInvoices.filter((i) => i.agingCategory === '90+ Days').reduce((a, c) => a + c.remainingAmountIdr, 0),
  };
  res.json({ success: true, data: agingSummary });
});

// ==========================================
// 4. CASH & BANK & RECONCILIATION API
// ==========================================
financeRouter.get('/finance/cash-bank', (req: Request, res: Response) => {
  res.json({
    success: true,
    bankAccounts,
    pettyCashTransactions,
  });
});

financeRouter.post('/finance/cash-bank/reconcile', (req: Request, res: Response) => {
  const { bankAccountId, bankStatementBalanceIdr } = req.body;
  const account = bankAccounts.find((b) => b.id === bankAccountId);

  if (!account) {
    return res.status(404).json({ error: 'Bank Account not found.' });
  }

  account.bankStatementBalanceIdr = Number(bankStatementBalanceIdr || account.bookBalanceIdr);
  account.unreconciledAmountIdr = Math.abs(account.bookBalanceIdr - account.bankStatementBalanceIdr);
  account.lastReconciledAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  res.json({
    success: true,
    message: `Bank Reconciliation completed for ${account.bankName}. Difference: IDR ${account.unreconciledAmountIdr.toLocaleString()}`,
    data: account,
  });
});

// ==========================================
// 5. BUDGET MANAGEMENT & COST CENTERS API
// ==========================================
financeRouter.get('/finance/budgets', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: costCenterBudgets,
  });
});

// ==========================================
// 6. PRODUCT COSTING & COGM VARIANCE API
// ==========================================
financeRouter.get('/finance/product-costing', (req: Request, res: Response) => {
  res.json({
    success: true,
    productCosting: productCostingList,
    costVariances: costVariances,
  });
});

// ==========================================
// 7. FIXED ASSETS & DEPRECIATION API
// ==========================================
financeRouter.get('/finance/assets', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: fixedAssets,
  });
});

financeRouter.post('/finance/depreciation/run', (req: Request, res: Response) => {
  let totalDepreciationPosted = 0;

  fixedAssets.forEach((asset) => {
    asset.accumulatedDepreciationIdr += asset.monthlyDepreciationIdr;
    asset.bookValueIdr = Math.max(0, asset.acquisitionCostIdr - asset.accumulatedDepreciationIdr);
    totalDepreciationPosted += asset.monthlyDepreciationIdr;
  });

  // Post journal automatically
  const newDepreciationJournal: JournalEntry = {
    id: `JE-DEP-${Date.now()}`,
    voucherNumber: `JV/DEP/2026/08`,
    date: new Date().toISOString().substring(0, 10),
    period: '2026-08',
    sourceModule: 'Maintenance',
    sourceReference: 'DEP-RUN-2026-08',
    description: 'Penyusutan Bulanan Aset Tetap Mesin Produksi & Instrument Lab QC',
    totalDebitIdr: totalDepreciationPosted,
    totalCreditIdr: totalDepreciationPosted,
    status: 'Posted',
    postedBy: 'System Auto-Depreciation Engine',
    postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lines: [
      { id: 'jl-dep-1', accountCode: '6140-01', accountName: 'Beban Penyusutan Aset Tetap Pabrik', debitIdr: totalDepreciationPosted, creditIdr: 0, memo: 'Monthly asset depreciation' },
      { id: 'jl-dep-2', accountCode: '1220-01', accountName: 'Akumulasi Penyusutan Mesin Produksi', debitIdr: 0, creditIdr: totalDepreciationPosted, memo: 'Accumulated depreciation' },
    ],
  };

  journalEntries.unshift(newDepreciationJournal);

  res.json({
    success: true,
    message: `Monthly Depreciation run successfully posted. Total Depreciation: IDR ${totalDepreciationPosted.toLocaleString()}`,
    data: fixedAssets,
  });
});

// ==========================================
// 8. TAX MANAGEMENT API
// ==========================================
financeRouter.get('/finance/tax', (req: Request, res: Response) => {
  const ppnMasukan = taxTransactions.filter((t) => t.type.includes('Masukan')).reduce((a, c) => a + c.taxAmountIdr, 0);
  const ppnKeluaran = taxTransactions.filter((t) => t.type.includes('Keluaran')).reduce((a, c) => a + c.taxAmountIdr, 0);
  const netPpnPayable = Math.max(0, ppnKeluaran - ppnMasukan);

  res.json({
    success: true,
    summary: {
      ppnMasukanIdr: ppnMasukan,
      ppnKeluaranIdr: ppnKeluaran,
      netPpnPayableIdr: netPpnPayable,
    },
    data: taxTransactions,
  });
});

// ==========================================
// 9. FINANCIAL STATEMENTS & RATIOS API
// ==========================================
financeRouter.get('/finance/financial-statements', (req: Request, res: Response) => {
  // Compute P&L
  const revenue = coaList.filter((c) => c.category === 'Revenue').reduce((a, c) => a + c.balanceIdr, 0);
  const cogs = coaList.filter((c) => c.category === 'COGS').reduce((a, c) => a + c.balanceIdr, 0);
  const grossProfit = revenue - cogs;
  const opex = coaList.filter((c) => c.category === 'Expense').reduce((a, c) => a + c.balanceIdr, 0);
  const netProfit = grossProfit - opex;

  // Compute Balance Sheet
  const totalAssets = coaList.filter((c) => c.category === 'Asset').reduce((a, c) => a + (c.balanceType === 'Debit' ? c.balanceIdr : -c.balanceIdr), 0);
  const totalLiabilities = coaList.filter((c) => c.category === 'Liability').reduce((a, c) => a + c.balanceIdr, 0);
  const totalEquity = coaList.filter((c) => c.category === 'Equity').reduce((a, c) => a + c.balanceIdr, 0);

  // Financial Ratios
  const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const netMarginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;

  res.json({
    success: true,
    profitLoss: {
      totalRevenueIdr: revenue,
      totalCogsIdr: cogs,
      grossProfitIdr: grossProfit,
      totalOperatingExpenseIdr: opex,
      netProfitIdr: netProfit,
    },
    balanceSheet: {
      totalAssetsIdr: totalAssets,
      totalLiabilitiesIdr: totalLiabilities,
      totalEquityIdr: totalEquity,
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1000,
    },
    ratios: {
      grossMarginPct: Number(grossMarginPct.toFixed(2)),
      netMarginPct: Number(netMarginPct.toFixed(2)),
      currentRatio: Number(currentRatio.toFixed(2)),
    },
  });
});

// ==========================================
// 10. PERIOD CLOSING & CHECKLIST API
// ==========================================
financeRouter.get('/finance/closing', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: closingStatus,
  });
});

financeRouter.post('/finance/closing/run', (req: Request, res: Response) => {
  const { period, action } = req.body;

  if (action === 'Hard Lock') {
    closingStatus = {
      period: period || '2026-08',
      status: 'Hard Locked',
      closedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      closedBy: 'Bambang S. (Finance Controller)',
      checklist: {
        bankReconciliation: true,
        apArAgingVerified: true,
        inventoryValuationRun: true,
        depreciationPosted: true,
        taxReconciliation: true,
        trialBalanceBalanced: true,
      },
    };
    return res.json({ success: true, message: `Period ${period} successfully Hard Locked. All GL posting is now restricted.`, data: closingStatus });
  } else {
    closingStatus.status = 'Open';
    return res.json({ success: true, message: `Period ${period} reopened for accounting adjustments.`, data: closingStatus });
  }
});

export default financeRouter;
