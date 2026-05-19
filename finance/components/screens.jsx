// screens.jsx — All the screens of the Khaata mobile redesign.

const { useState, useMemo } = React;

// ── HOME ────────────────────────────────────────────────────────────────
function HomeScreen({ data, onNav, onAddTxn, onTxnClick }) {
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = data.accounts.reduce((s, a) => s + a.balance, 0);
  const monthTxns = data.transactions;
  const s = summary(monthTxns);
  const recent = monthTxns.slice(0, 4);
  const spark = [12200, 11800, 12900, 13500, 12100, 11900, 11850];

  const hour = 22; // pinned to evening to match the original "Good Night"
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night';

  return (
    <ScreenScroll>
      {/* Top bar */}
      <div style={{ padding: '8px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: tokens.muted, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>{greeting}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: tokens.ink, marginTop: 2 }}>
            {data.user.name.split(' ')[0]}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <IconBtn name="search" onClick={() => onNav('search')}/>
          <IconBtn name="bell" badge/>
        </div>
      </div>

      {/* Hero balance card */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padding={20} style={{
          background: '#16161a',
          color: '#fff',
          border: 'none',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 30px -16px rgba(22,22,26,0.6), 0 2px 0 rgba(22,22,26,0.04)',
        }}>
          {/* subtle texture */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0, transparent 40%)' }}/>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>Total balance</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {showBalance ? fmt(totalBalance) : '৳ ••••'}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                across {data.accounts.length} accounts · May
              </div>
            </div>
            <button onClick={() => setShowBalance(v => !v)} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999, padding: 8, color: '#fff', cursor: 'pointer',
            }}>
              <Icon name={showBalance ? 'eye' : 'eye-off'} size={16} strokeWidth={1.8}/>
            </button>
          </div>

          {/* income/expense + sparkline */}
          <div style={{ position: 'relative', marginTop: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', gap: 22 }}>
              <Stat label="Income"  value={fmt(s.income)}  tint="rgba(120,220,170,0.95)" arrow="up"/>
              <Stat label="Expense" value={fmt(s.expense)} tint="rgba(255,160,140,0.95)" arrow="down"/>
            </div>
            <Sparkline data={spark} color="rgba(255,255,255,0.7)" width={86} height={26}/>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <QuickAction label="Income"   icon="receive"  onClick={() => onAddTxn('income')}/>
          <QuickAction label="Expense"  icon="send"     onClick={() => onAddTxn('expense')}/>
          <QuickAction label="Transfer" icon="arrow-lr" onClick={() => onAddTxn('transfer')}/>
          <QuickAction label="Loan"     icon="loan"     onClick={() => onNav('loans')}/>
        </div>
      </div>

      {/* Accounts */}
      <div style={{ padding: '20px 0 0' }}>
        <div style={{ padding: '0 20px' }}>
          <SectionHead title="Accounts" action="All" onAction={() => onNav('accounts')}/>
        </div>
        <div style={{
          display: 'flex', gap: 10, padding: '0 20px 4px', overflowX: 'auto',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {data.accounts.map(a => <AccountCard key={a.id} account={a}/>)}
          <div style={{ minWidth: 1 }}/>
        </div>
      </div>

      {/* Loans summary */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionHead title="Loans" action="Manage" onAction={() => onNav('loans')}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <LoanTile dir="receive" data={data.loans.receivable}/>
          <LoanTile dir="payable"  data={data.loans.payable}/>
          <LoanTile dir="active"   data={data.loans.active}/>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionHead title="Recent activity" action="See all" onAction={() => onNav('transactions')}/>
        <Card padding={4}>
          {recent.map((t, i) => (
            <TxnRow key={t.id} t={t} onClick={() => onTxnClick(t)} divider={i < recent.length - 1}/>
          ))}
        </Card>
      </div>

      {/* Budget status */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionHead title="Budget · May" action="Edit" onAction={() => onNav('budgets')}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {data.budgets.slice(0, 4).map(b => <BudgetCard key={b.name} b={b}/>)}
        </div>
      </div>

      <div style={{ height: 24 }}/>
    </ScreenScroll>
  );
}

function Stat({ label, value, tint, arrow }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: tint, fontSize: 11, fontWeight: 600, letterSpacing: '.04em' }}>
        <Icon name={arrow === 'up' ? 'arrow-up' : 'arrow-down'} size={11} strokeWidth={2.2}/>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{value}</div>
    </div>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: tokens.paper, border: `1px solid ${tokens.hairline}`, borderRadius: 16,
      padding: '12px 4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: 'pointer', fontFamily: 'inherit', color: tokens.ink,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 12, background: tokens.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={17} color={tokens.ink} strokeWidth={1.8}/>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: tokens.ink2 }}>{label}</div>
    </button>
  );
}

function AccountCard({ account }) {
  const negative = account.balance < 0;
  return (
    <div style={{
      flex: '0 0 auto', minWidth: 158, padding: 14,
      background: tokens.paper, border: `1px solid ${tokens.hairline}`, borderRadius: 18,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 10, background: tokens.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={account.icon} size={15} color={tokens.ink} strokeWidth={1.7}/>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', color: tokens.muted, textTransform: 'uppercase' }}>{account.type}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: tokens.muted, fontFamily: tokens.fMono }}>{account.number}</div>
      <div style={{ marginTop: 2, fontSize: 18, fontWeight: 700, color: negative ? tokens.expense : tokens.ink, letterSpacing: '-.01em' }}>
        {fmt(account.balance)}
      </div>
    </div>
  );
}

function LoanTile({ dir, data }) {
  const map = {
    receive: { tint: tokens.income, label: 'Receivable', icon: 'arrow-down' },
    payable: { tint: tokens.expense, label: 'Payable',   icon: 'arrow-up'   },
    active:  { tint: tokens.ink,     label: 'Active',    icon: 'loan'       },
  };
  const m = map[dir];
  return (
    <Card padding={12}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name={m.icon} size={12} color={m.tint} strokeWidth={2}/>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', color: tokens.muted, textTransform: 'uppercase' }}>{m.label}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 17, fontWeight: 700, color: m.tint, letterSpacing: '-.01em' }}>{fmt(data.amount)}</div>
      <div style={{ marginTop: 2, fontSize: 11, color: tokens.muted }}>{data.count} {data.count === 1 ? 'item' : 'items'}{data.rate ? ` · ${data.rate}` : ''}</div>
    </Card>
  );
}

function TxnRow({ t, onClick, divider }) {
  const isExp = t.type === 'expense';
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
      borderBottom: divider ? `1px solid ${tokens.divider}` : 'none',
      cursor: 'pointer',
    }}>
      <CatDisc name={t.category} size={38}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: tokens.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.category}</div>
        <div style={{ marginTop: 2, fontSize: 12, color: tokens.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.note} · {fmtDate(t.date)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: isExp ? tokens.expense : tokens.income, letterSpacing: '-.005em' }}>
          {isExp ? '−' : '+'}{fmt(t.amount).replace('−', '')}
        </div>
        <div style={{ marginTop: 2, fontSize: 10, color: tokens.muted, fontFamily: tokens.fMono }}>{t.time}</div>
      </div>
    </div>
  );
}

function BudgetCard({ b }) {
  const pct = Math.min(100, Math.round((b.used / b.limit) * 100));
  const color = tokens.cat[b.cat] || tokens.ink;
  const over = pct >= 90;
  return (
    <Card padding={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CatDisc name={b.cat} size={28}/>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.ink, flex: 1 }}>{b.name}</div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: tokens.ink, letterSpacing: '-.01em' }}>{fmt(b.used)}</span>
        <span style={{ fontSize: 11, color: tokens.muted }}>of {fmt(b.limit)}</span>
      </div>
      <div style={{ marginTop: 8, height: 4, background: tokens.divider, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: over ? tokens.expense : color, borderRadius: 999 }}/>
      </div>
      <div style={{ marginTop: 6, fontSize: 10, color: over ? tokens.expense : tokens.muted, fontWeight: 500 }}>
        {pct}% used{over ? ' · over' : ''}
      </div>
    </Card>
  );
}

// ── TRANSACTIONS ────────────────────────────────────────────────────────
function TxnsScreen({ data, onTxnClick, onAddTxn }) {
  const [filter, setFilter] = useState('all');
  const txns = useMemo(() => {
    if (filter === 'all') return data.transactions;
    return data.transactions.filter(t => t.type === filter);
  }, [filter, data]);

  const grouped = groupByDate(txns);
  const s = summary(data.transactions);

  return (
    <ScreenScroll>
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: tokens.ink }}>Transactions</div>
        <div style={{ marginTop: 2, fontSize: 13, color: tokens.muted }}>{data.transactions.length} entries · May 2026</div>
      </div>

      {/* Mini stats */}
      <div style={{ padding: '14px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <MiniStat label="In"  value={fmt(s.income)}  tint={tokens.income}/>
        <MiniStat label="Out" value={fmt(s.expense)} tint={tokens.expense}/>
        <MiniStat label="Net" value={fmt(s.net)}     tint={s.net >= 0 ? tokens.ink : tokens.expense}/>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <Chip active={filter === 'all'}     onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'expense'} onClick={() => setFilter('expense')}>Expense</Chip>
        <Chip active={filter === 'income'}  onClick={() => setFilter('income')}>Income</Chip>
        <Chip>This month</Chip>
        <Chip><Icon name="filter" size={12}/> Filters</Chip>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        {grouped.map(([date, ts]) => {
          const ds = summary(ts);
          return (
            <div key={date} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 8px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.ink2 }}>{fmtDate(date)}</div>
                <div style={{ fontSize: 11, color: tokens.muted, fontFamily: tokens.fMono }}>
                  {ds.expense > 0 && <span style={{ color: tokens.expense }}>−৳{ds.expense.toLocaleString('en-IN')}</span>}
                  {ds.income > 0 && ds.expense > 0 && <span style={{ margin: '0 6px' }}>·</span>}
                  {ds.income > 0 && <span style={{ color: tokens.income }}>+৳{ds.income.toLocaleString('en-IN')}</span>}
                </div>
              </div>
              <Card padding={4}>
                {ts.map((t, i) => <TxnRow key={t.id} t={t} onClick={() => onTxnClick(t)} divider={i < ts.length - 1}/>)}
              </Card>
            </div>
          );
        })}
      </div>

      <div style={{ height: 24 }}/>
    </ScreenScroll>
  );
}

function MiniStat({ label, value, tint }) {
  return (
    <div style={{ background: tokens.paper, border: `1px solid ${tokens.hairline}`, borderRadius: 14, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', color: tokens.muted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: tint, letterSpacing: '-.01em' }}>{value}</div>
    </div>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, padding: '7px 12px', borderRadius: 999,
      background: active ? tokens.ink : tokens.paper,
      color: active ? '#fff' : tokens.ink2,
      border: `1px solid ${active ? tokens.ink : tokens.hairline}`,
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>{children}</button>
  );
}

// ── REPORTS ──────────────────────────────────────────────────────────────
function ReportsScreen({ data }) {
  const s = summary(data.transactions);
  // category totals (expense only)
  const catTotals = {};
  data.transactions.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const cats = Object.entries(catTotals).sort((a,b) => b[1] - a[1]);
  const maxCat = Math.max(...cats.map(c => c[1]));

  // 7-day expense series (mock)
  const weekly = [
    { day: 'M', v: 280 }, { day: 'T', v: 1500 }, { day: 'W', v: 720 },
    { day: 'T', v: 1200 }, { day: 'F', v: 1080 }, { day: 'S', v: 420 }, { day: 'S', v: 593 },
  ];
  const maxDay = Math.max(...weekly.map(d => d.v));

  return (
    <ScreenScroll>
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: tokens.ink }}>Reports</div>
        <div style={{ marginTop: 2, fontSize: 13, color: tokens.muted }}>May · last 4 weeks</div>
      </div>

      {/* Net hero */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padding={18}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: tokens.muted, textTransform: 'uppercase' }}>Net savings</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: s.net >= 0 ? tokens.income : tokens.expense }}>
            {fmt(s.net, { sign: true })}
          </div>
          <div style={{ marginTop: 2, fontSize: 12, color: tokens.muted }}>
            {fmt(s.income)} in · {fmt(s.expense)} out
          </div>

          {/* dual progress */}
          <div style={{ marginTop: 16 }}>
            <BarPair label="Income"  value={s.income}  max={s.income + s.expense} color={tokens.income}/>
            <div style={{ height: 8 }}/>
            <BarPair label="Expense" value={s.expense} max={s.income + s.expense} color={tokens.expense}/>
          </div>
        </Card>
      </div>

      {/* Weekly chart */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionHead title="This week · expenses"/>
        <Card padding={16}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {weekly.map((d, i) => {
              const h = Math.max(6, Math.round((d.v / maxDay) * 110));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', height: h, borderRadius: '6px 6px 2px 2px',
                    background: i === 1 ? tokens.ink : tokens.cream,
                  }}/>
                  <div style={{ fontSize: 10, color: tokens.muted, fontWeight: 500 }}>{d.day}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: tokens.muted }}>
            Highest: Tuesday · {fmt(1500)}
          </div>
        </Card>
      </div>

      {/* Category breakdown */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionHead title="By category"/>
        <Card padding={14}>
          {cats.map(([name, val], i) => (
            <div key={name} style={{
              padding: '10px 2px',
              borderBottom: i < cats.length - 1 ? `1px solid ${tokens.divider}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CatDisc name={name} size={30}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tokens.ink }}>{name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tokens.ink }}>{fmt(val)}</span>
                  </div>
                  <div style={{ marginTop: 6, height: 3, background: tokens.divider, borderRadius: 999 }}>
                    <div style={{ width: (val / maxCat * 100) + '%', height: '100%',
                      background: tokens.cat[name] || tokens.ink, borderRadius: 999 }}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ height: 24 }}/>
    </ScreenScroll>
  );
}

function BarPair({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: tokens.muted, fontWeight: 600, letterSpacing: '.04em' }}>{label}</span>
        <span style={{ color: tokens.ink, fontWeight: 600, fontFamily: tokens.fMono }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 8, background: tokens.divider, borderRadius: 999 }}>
        <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 999 }}/>
      </div>
    </div>
  );
}

// ── ACCOUNTS ────────────────────────────────────────────────────────────
function AccountsScreen({ data, onBack }) {
  return (
    <ScreenScroll>
      <ScreenHeader title="Accounts" onBack={onBack}/>
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.accounts.map(a => (
          <Card key={a.id} padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: tokens.cream,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={a.icon} size={20} color={tokens.ink} strokeWidth={1.7}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.ink }}>{a.name}</div>
                <div style={{ fontSize: 12, color: tokens.muted, fontFamily: tokens.fMono }}>{a.number}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: a.balance < 0 ? tokens.expense : tokens.ink, letterSpacing: '-.01em' }}>{fmt(a.balance)}</div>
                <div style={{ fontSize: 10, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{a.type}</div>
              </div>
            </div>
          </Card>
        ))}
        <button style={{
          marginTop: 6, padding: '14px', background: tokens.paper, border: `1px dashed ${tokens.faint}`, borderRadius: 16,
          color: tokens.ink2, fontWeight: 600, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}><Icon name="plus" size={16}/> Add account</button>
      </div>
    </ScreenScroll>
  );
}

// ── MORE ─────────────────────────────────────────────────────────────────
function MoreScreen({ data, onNav, onLogout }) {
  const items = [
    { id: 'accounts',   label: 'Accounts',   icon: 'bank',     hint: `${data.accounts.length} accounts` },
    { id: 'lists',      label: 'Market lists', icon: 'list',   hint: `${data.lists.length} lists` },
    { id: 'notes',      label: 'Notes',      icon: 'note',     hint: `${data.notes.length} notes` },
    { id: 'loans',      label: 'Loans',      icon: 'loan',     hint: `${data.loans.payable.count + data.loans.receivable.count} active` },
    { id: 'categories', label: 'Categories', icon: 'filter',   hint: '8 categories' },
    { id: 'search',     label: 'Search',     icon: 'search',   hint: 'Find any transaction' },
    { id: 'settings',   label: 'Settings',   icon: 'settings', hint: 'Currency, backup, theme' },
    { id: 'help',       label: 'Help & guide', icon: 'other',  hint: 'How-to and FAQs' },
  ];

  return (
    <ScreenScroll>
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: tokens.ink }}>More</div>
      </div>
      {/* Profile card */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, background: tokens.ink, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16,
            }}>{initials(data.user.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: tokens.ink }}>{data.user.name}</div>
              <div style={{ fontSize: 12, color: tokens.muted, fontFamily: tokens.fMono }}>{data.user.handle}</div>
            </div>
            <button style={{
              padding: '7px 12px', borderRadius: 999, background: tokens.cream, border: `1px solid ${tokens.hairline}`,
              fontSize: 11, fontWeight: 600, color: tokens.ink2, fontFamily: 'inherit', cursor: 'pointer',
            }}>Edit</button>
          </div>
        </Card>
      </div>

      {/* Menu */}
      <div style={{ padding: '16px 20px 0' }}>
        <Card padding={4}>
          {items.map((it, i) => (
            <div key={it.id} onClick={() => onNav(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
              borderBottom: i < items.length - 1 ? `1px solid ${tokens.divider}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 11, background: tokens.cream,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={it.icon} size={16} color={tokens.ink}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.ink }}>{it.label}</div>
                <div style={{ fontSize: 11, color: tokens.muted }}>{it.hint}</div>
              </div>
              <Icon name="arrow-right" size={14} color={tokens.muted}/>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: 14, background: 'transparent', border: `1px solid ${tokens.hairline}`, borderRadius: 14,
          color: tokens.expense, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}><Icon name="logout" size={15} color={tokens.expense}/> Log out</button>
      </div>
      <div style={{ height: 24 }}/>
    </ScreenScroll>
  );
}

// ── LISTS / NOTES / LOANS (compact) ─────────────────────────────────────
function ListsScreen({ data, onBack }) {
  return (
    <ScreenScroll>
      <ScreenHeader title="Market lists" onBack={onBack}/>
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.lists.map(l => (
          <Card key={l.id} padding={14}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.ink }}>{l.name}</div>
                <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>{l.done} of {l.items} done</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.ink }}>{fmt(l.total)}</div>
                <div style={{ fontSize: 10, color: tokens.muted, fontWeight: 600 }}>{fmtDate(l.date)}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, height: 4, background: tokens.divider, borderRadius: 999 }}>
              <div style={{ width: (l.done / l.items * 100) + '%', height: '100%', background: tokens.income, borderRadius: 999 }}/>
            </div>
          </Card>
        ))}
      </div>
    </ScreenScroll>
  );
}

function NotesScreen({ data, onBack }) {
  return (
    <ScreenScroll>
      <ScreenHeader title="Notes" onBack={onBack}/>
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.notes.map(n => (
          <Card key={n.id} padding={14}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {n.pinned && <Icon name="pin" size={14} color={tokens.expense}/>}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.ink }}>{n.title}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: tokens.ink2, lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: tokens.muted, fontFamily: tokens.fMono }}>{fmtDate(n.date)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScreenScroll>
  );
}

function LoansScreen({ data, onBack }) {
  const items = [
    { name: 'Karim bhai',     dir: 'payable',  amount: 1500, due: '2026-05-25' },
    { name: 'Office advance', dir: 'payable',  amount:  200, due: '2026-05-30' },
    { name: 'Tanvir',         dir: 'receive',  amount: 1200, due: '2026-05-22' },
    { name: 'Cousin Riya',    dir: 'receive',  amount:  800, due: '2026-06-02' },
    { name: 'Nila',           dir: 'receive',  amount:  400, due: '2026-06-05' },
    { name: 'Bank EMI',       dir: 'active',   amount: 18000, due: '24 months' },
  ];
  return (
    <ScreenScroll>
      <ScreenHeader title="Loans" onBack={onBack}/>
      <div style={{ padding: '4px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        <LoanTile dir="receive" data={data.loans.receivable}/>
        <LoanTile dir="payable"  data={data.loans.payable}/>
        <LoanTile dir="active"   data={data.loans.active}/>
      </div>
      <div style={{ padding: '14px 20px 0' }}>
        <SectionHead title="Outstanding"/>
        <Card padding={4}>
          {items.map((it, i) => {
            const isReceive = it.dir === 'receive';
            const tint = it.dir === 'active' ? tokens.ink : isReceive ? tokens.income : tokens.expense;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                borderBottom: i < items.length - 1 ? `1px solid ${tokens.divider}` : 'none',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 11,
                  background: hexAlpha(tint, 0.10), color: tint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={it.dir === 'active' ? 'loan' : isReceive ? 'arrow-down' : 'arrow-up'} size={15} strokeWidth={2}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.ink }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: tokens.muted }}>Due {it.due}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: tint }}>{fmt(it.amount)}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </ScreenScroll>
  );
}

// ── Common shells ───────────────────────────────────────────────────────
function ScreenScroll({ children }) {
  return (
    <div style={{
      height: '100%', overflowY: 'auto', overflowX: 'hidden',
      paddingTop: 56, paddingBottom: 110, // status bar + tab bar gutters
      background: tokens.bg,
      WebkitOverflowScrolling: 'touch',
    }}>{children}</div>
  );
}

function ScreenHeader({ title, onBack }) {
  return (
    <div style={{ padding: '4px 20px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 12, background: tokens.paper, border: `1px solid ${tokens.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }}/></button>
      )}
      <div style={{ fontSize: 22, fontWeight: 700, color: tokens.ink }}>{title}</div>
    </div>
  );
}

function IconBtn({ name, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 12, background: tokens.paper,
      border: `1px solid ${tokens.hairline}`, color: tokens.ink, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <Icon name={name} size={18} strokeWidth={1.8}/>
      {badge && <span style={{
        position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 999,
        background: tokens.expense, border: '2px solid ' + tokens.paper, boxSizing: 'content-box',
      }}/>}
    </button>
  );
}

Object.assign(window, {
  HomeScreen, TxnsScreen, ReportsScreen, AccountsScreen,
  MoreScreen, ListsScreen, NotesScreen, LoansScreen,
  ScreenScroll, ScreenHeader, IconBtn,
});
