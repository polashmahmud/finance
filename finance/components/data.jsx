// data.jsx — Seed data + design tokens for the Khaata redesign.
// All data based on the user's backup JSON, expanded with realistic
// scenarios so the dashboard shows meaningful content.

const tokens = {
  // Palette (warm paper, deep ink, two functional accents)
  bg:       '#fafaf7',
  paper:    '#ffffff',
  cream:    '#f5f1e8',
  ink:      '#16161a',
  ink2:     '#3a3a40',
  muted:    '#7c7a73',
  faint:    '#b8b5ac',
  hairline: '#e9e5dc',
  divider:  '#efece4',

  // Functional
  income:   '#2f7d5c',  // deep emerald
  incomeBg: '#e8f1ec',
  expense:  '#b14437',  // terracotta
  expenseBg:'#fbeae6',
  neutral:  '#16161a',

  // Category colors (refined from the raw HSV values in the json)
  cat: {
    Salary:     '#2f7d5c',
    Family:     '#5a7b3e',
    Groceries:  '#b14437',
    Shopping:   '#3f4a7a',
    Transport:  '#2a6695',
    Health:     '#a23a6e',
    Gifts:      '#7a3c8a',
    Restaurant: '#b16a26',
    Bills:      '#5e5b54',
    Other:      '#7c7a73',
  },

  // Type ramp
  fSans: "'Plus Jakarta Sans', 'Hind Siliguri', system-ui, sans-serif",
  fMono: "'JetBrains Mono', ui-monospace, monospace",
  fBn:   "'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif",
};

// Format BDT, never as 'BDT' — symbol ৳ (U+09F3), thousands separator.
function fmt(amount, { sign = false } = {}) {
  const abs = Math.abs(Math.round(amount));
  const grouped = abs.toLocaleString('en-IN');
  const prefix = amount < 0 ? '−' : (sign && amount > 0 ? '+' : '');
  return `${prefix}৳${grouped}`;
}

// Format a date (ISO) → "19 May" / "Today" / "Yesterday"
function fmtDate(iso) {
  const d = new Date(iso);
  const today = new Date('2026-05-19');
  const yest = new Date('2026-05-18');
  if (iso === '2026-05-19') return 'Today';
  if (iso === '2026-05-18') return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// Initials helper
const initials = (s) => (s || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

// Seed data — extends the user's two transactions into a believable month.
const seed = {
  user: { name: 'Polash Mahmud', handle: '@polashmahmud' },
  accounts: [
    { id: 'bank',  name: 'Bank',  type: 'Bank',   balance: 8470,  number: '•• 4421', icon: 'bank'   },
    { id: 'cash',  name: 'Cash',  type: 'Wallet', balance: 1230,  number: 'in hand', icon: 'cash'   },
    { id: 'bkash', name: 'bKash', type: 'Mobile', balance: 2150,  number: '•• 8821', icon: 'mobile' },
  ],
  loans: {
    receivable: { amount: 2400, count: 3, label: 'You will receive' },
    payable:    { amount: 1700, count: 2, label: 'You will pay'     },
    active:     { amount: 18000, count: 1, label: 'Active loan',  rate: '9.5%' },
  },
  budgets: [
    { name: 'Groceries',  used: 4800, limit: 7000, cat: 'Groceries'  },
    { name: 'Family',     used: 2200, limit: 4000, cat: 'Family'     },
    { name: 'Transport',  used: 1450, limit: 2000, cat: 'Transport'  },
    { name: 'Restaurant', used: 1800, limit: 2500, cat: 'Restaurant' },
    { name: 'Health',     used:  300, limit: 1500, cat: 'Health'     },
    { name: 'Shopping',   used: 2900, limit: 3000, cat: 'Shopping'   },
    { name: 'Gifts',      used:  400, limit: 1500, cat: 'Gifts'      },
    { name: 'Bills',      used: 1200, limit: 2000, cat: 'Bills'      },
  ],
  transactions: [
    { id: 't1',  date: '2026-05-19', time: '22:21', type: 'expense', category: 'Groceries',  amount: 333,  account: 'bank', note: 'Daily bazar' },
    { id: 't2',  date: '2026-05-19', time: '22:21', type: 'expense', category: 'Family',     amount: 200,  account: 'bank', note: 'Ammu' },
    { id: 't3',  date: '2026-05-19', time: '09:10', type: 'expense', category: 'Transport',  amount: 60,   account: 'cash', note: 'Bus to office' },
    { id: 't4',  date: '2026-05-18', time: '20:45', type: 'expense', category: 'Restaurant', amount: 720,  account: 'bkash', note: 'Iftar at Star' },
    { id: 't5',  date: '2026-05-18', time: '14:02', type: 'income',  category: 'Salary',     amount: 45000, account: 'bank', note: 'May salary' },
    { id: 't6',  date: '2026-05-17', time: '11:30', type: 'expense', category: 'Shopping',   amount: 1850, account: 'bank', note: 'Eid shirt' },
    { id: 't7',  date: '2026-05-17', time: '08:15', type: 'expense', category: 'Groceries',  amount: 420,  account: 'cash', note: 'Vegetables' },
    { id: 't8',  date: '2026-05-16', time: '19:00', type: 'expense', category: 'Health',     amount: 300,  account: 'bkash', note: 'Pharmacy' },
    { id: 't9',  date: '2026-05-15', time: '13:20', type: 'expense', category: 'Bills',      amount: 1200, account: 'bank', note: 'Electricity' },
    { id: 't10', date: '2026-05-14', time: '21:30', type: 'expense', category: 'Restaurant', amount: 1080, account: 'bkash', note: 'Dinner with Tanvir' },
    { id: 't11', date: '2026-05-13', time: '16:45', type: 'expense', category: 'Transport',  amount: 280,  account: 'cash', note: 'Uber to airport' },
    { id: 't12', date: '2026-05-12', time: '12:00', type: 'income',  category: 'Other',      amount: 2000, account: 'bkash', note: 'Freelance — logo' },
    { id: 't13', date: '2026-05-11', time: '10:30', type: 'expense', category: 'Groceries',  amount: 1240, account: 'bank', note: 'Monthly stock' },
    { id: 't14', date: '2026-05-10', time: '18:00', type: 'expense', category: 'Gifts',      amount: 400,  account: 'cash', note: 'Birthday — Nila' },
  ],
  lists: [
    { id: 'l1', name: 'Market — 19 May', date: '2026-05-19', items: 6, done: 2, total: 980 },
    { id: 'l2', name: 'Eid shopping',    date: '2026-05-15', items: 9, done: 9, total: 4280 },
  ],
  notes: [
    { id: 'n1', title: 'Loan plan',   body: 'Repay Karim bhai 1,500 before 25th. Adjust groceries.', pinned: true,  date: '2026-05-19' },
    { id: 'n2', title: 'Subscription audit', body: 'Cancel: Spotify family, extra Netflix screen.',  pinned: false, date: '2026-05-12' },
  ],
};

// Aggregate helpers
function summary(txns) {
  const income  = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
}

function groupByDate(txns) {
  const map = {};
  txns.forEach(t => { (map[t.date] = map[t.date] || []).push(t); });
  return Object.entries(map).sort((a,b) => b[0].localeCompare(a[0]));
}

Object.assign(window, { tokens, fmt, fmtDate, initials, seed, summary, groupByDate });
