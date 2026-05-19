// app.jsx — Main app. Tab navigation, modal stack, tweaks.

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "ink",
  "showTweaks": true,
  "frame": "iphone"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = {
  ink:     { ink: '#16161a', cream: '#f5f1e8', bg: '#fafaf7' },
  midnight:{ ink: '#0c1730', cream: '#eef2fa', bg: '#f8f9fc' },
  forest:  { ink: '#1c3026', cream: '#eaf1ec', bg: '#f7faf7' },
  plum:    { ink: '#2a1530', cream: '#f3eaf3', bg: '#fbf8fb' },
};

function App() {
  const t = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState('home');
  const [subScreen, setSubScreen] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState('expense');
  const [data] = useState(seed);

  // Apply accent — mutates tokens at runtime
  useEffect(() => {
    const a = ACCENT_OPTIONS[t.values.accent] || ACCENT_OPTIONS.ink;
    tokens.ink = a.ink;
    tokens.cream = a.cream;
    tokens.bg = a.bg;
  }, [t.values.accent]);

  // global handlers
  const openAdd = (type) => { setAddType(type); setAddOpen(true); };
  const goSub = (id) => setSubScreen(id);
  const back = () => setSubScreen(null);

  // Decide which screen to render
  let screen;
  if (subScreen === 'accounts') screen = <AccountsScreen data={data} onBack={back}/>;
  else if (subScreen === 'lists') screen = <ListsScreen data={data} onBack={back}/>;
  else if (subScreen === 'notes') screen = <NotesScreen data={data} onBack={back}/>;
  else if (subScreen === 'loans') screen = <LoansScreen data={data} onBack={back}/>;
  else if (tab === 'home')         screen = <HomeScreen data={data} onNav={goSub} onAddTxn={openAdd} onTxnClick={() => {}}/>;
  else if (tab === 'txns')         screen = <TxnsScreen data={data} onTxnClick={() => {}} onAddTxn={openAdd}/>;
  else if (tab === 'reports')      screen = <ReportsScreen data={data}/>;
  else if (tab === 'more')         screen = <MoreScreen data={data} onNav={(id) => {
    if (['accounts','lists','notes','loans'].includes(id)) goSub(id);
    else if (id === 'search') setTab('home');
  }} onLogout={() => {}}/>;

  return (
    <div className="stage">
      <div className="phone-wrap">
        <IOSDevice width={402} height={874}>
          <div style={{
            position: 'absolute', inset: 0,
            background: tokens.bg,
            display: 'flex', flexDirection: 'column',
          }}>
            {/* status-bar gutter (the IOSDevice already paints status bar absolutely) */}
            {screen}

            {/* Floating bottom nav */}
            <BottomNav
              tab={tab}
              onTab={(id) => { setSubScreen(null); setTab(id); }}
              onAdd={() => openAdd('expense')}
            />

            {/* Sub-screen back overlay still handled by component header */}
            {addOpen && (
              <AddTxnSheet
                type={addType}
                onTypeChange={setAddType}
                onClose={() => setAddOpen(false)}
                data={data}
              />
            )}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Accent"
            value={t.values.accent}
            options={[
              { value: 'ink',      label: 'Ink' },
              { value: 'midnight', label: 'Midnight' },
              { value: 'forest',   label: 'Forest' },
              { value: 'plum',     label: 'Plum' },
            ]}
            onChange={v => t.setTweak('accent', v)}
          />
        </TweakSection>
        <TweakSection label="Quick demo">
          <TweakButton label="Open Add — Expense" onClick={() => openAdd('expense')}/>
          <TweakButton label="Open Add — Income"  onClick={() => openAdd('income')}/>
          <TweakButton label="Jump to Reports"    onClick={() => { setSubScreen(null); setTab('reports'); }}/>
          <TweakButton label="Jump to Loans"      onClick={() => { setSubScreen('loans'); }} secondary/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ── BOTTOM NAV ───────────────────────────────────────────────────────────
function BottomNav({ tab, onTab, onAdd }) {
  const items = [
    { id: 'home',    label: 'Home',    icon: 'home' },
    { id: 'txns',    label: 'Activity', icon: 'list' },
    { id: 'add',     label: '', icon: 'plus' },
    { id: 'reports', label: 'Reports', icon: 'chart' },
    { id: 'more',    label: 'More',    icon: 'more' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 22, zIndex: 40,
      borderRadius: 26,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      border: `1px solid ${tokens.hairline}`,
      boxShadow: '0 10px 30px -10px rgba(22,22,26,0.25), 0 2px 6px rgba(22,22,26,0.04)',
      padding: '8px 8px',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', gap: 4,
    }}>
      {items.map(it => {
        if (it.id === 'add') {
          return (
            <button key="add" onClick={onAdd} style={{
              justifySelf: 'center', width: 50, height: 50, borderRadius: 18,
              background: tokens.ink, color: '#fff', border: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 18px -6px rgba(22,22,26,0.45)',
            }}>
              <Icon name="plus" size={22} color="#fff" strokeWidth={2.2}/>
            </button>
          );
        }
        const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            background: 'transparent', border: 0, padding: '6px 4px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: active ? tokens.ink : tokens.muted,
            fontFamily: 'inherit',
          }}>
            <Icon name={it.icon} size={20} strokeWidth={active ? 2.1 : 1.6}/>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── ADD TRANSACTION SHEET ────────────────────────────────────────────────
function AddTxnSheet({ type, onTypeChange, onClose, data }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'Salary' : 'Groceries');
  const [account, setAccount] = useState(data.accounts[0].id);
  const [note, setNote] = useState('');

  // category sets
  const expenseCats = ['Groceries','Family','Transport','Restaurant','Health','Shopping','Gifts','Bills','Other'];
  const incomeCats  = ['Salary','Other'];
  const cats = type === 'income' ? incomeCats : expenseCats;
  // keep category valid when switching type
  useEffect(() => { if (!cats.includes(category)) setCategory(cats[0]); }, [type]);

  const tint = type === 'income' ? tokens.income : type === 'expense' ? tokens.expense : tokens.ink;

  return (
    <>
      {/* dim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(22,22,26,0.45)',
        backdropFilter: 'blur(2px)', zIndex: 50, animation: 'fadeIn .15s ease-out',
      }}/>
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 60,
        background: tokens.paper, borderRadius: '24px 24px 0 0',
        padding: '12px 20px 24px',
        boxShadow: '0 -20px 40px -10px rgba(22,22,26,0.2)',
        animation: 'sheetUp .25s cubic-bezier(.2,.9,.3,1.1)',
        maxHeight: '85%', overflowY: 'auto',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: tokens.divider }}/>
        </div>

        {/* type switch */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: tokens.ink }}>New entry</div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 999, background: tokens.cream, border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="x" size={16}/></button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: 4,
          background: tokens.divider, borderRadius: 14, marginBottom: 18,
        }}>
          {[
            { id: 'expense',  label: 'Expense',  color: tokens.expense },
            { id: 'income',   label: 'Income',   color: tokens.income },
            { id: 'transfer', label: 'Transfer', color: tokens.ink },
          ].map(o => (
            <button key={o.id} onClick={() => onTypeChange(o.id)} style={{
              padding: '8px 4px', borderRadius: 11, border: 0, cursor: 'pointer', fontFamily: 'inherit',
              background: type === o.id ? tokens.paper : 'transparent',
              color: type === o.id ? o.color : tokens.muted,
              fontSize: 13, fontWeight: 700,
              boxShadow: type === o.id ? '0 1px 3px rgba(22,22,26,0.06)' : 'none',
            }}>{o.label}</button>
          ))}
        </div>

        {/* Amount input */}
        <div style={{ textAlign: 'center', padding: '8px 0 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: tokens.muted, textTransform: 'uppercase' }}>Amount</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: tokens.muted }}>৳</span>
            <input
              autoFocus
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              style={{
                width: 200, border: 0, outline: 'none', background: 'transparent',
                fontSize: 44, fontWeight: 700, fontFamily: 'inherit',
                color: tint, letterSpacing: '-.02em', textAlign: 'left',
              }}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: tokens.muted, textTransform: 'uppercase', marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {cats.map(c => {
              const sel = category === c;
              const col = tokens.cat[c] || tokens.ink;
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  flexShrink: 0, padding: '8px 12px', borderRadius: 14,
                  background: sel ? hexAlpha(col, 0.12) : tokens.paper,
                  border: `1px solid ${sel ? col : tokens.hairline}`,
                  color: sel ? col : tokens.ink2, fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon name={CAT_ICON[c] || 'other'} size={14} strokeWidth={1.8}/>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Account + note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Field label="Account" rightHint={data.accounts.find(a => a.id === account)?.name}>
            <div style={{ display: 'flex', gap: 6 }}>
              {data.accounts.map(a => {
                const sel = account === a.id;
                return (
                  <button key={a.id} onClick={() => setAccount(a.id)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 12,
                    background: sel ? tokens.ink : tokens.paper,
                    color: sel ? '#fff' : tokens.ink2,
                    border: `1px solid ${sel ? tokens.ink : tokens.hairline}`,
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Icon name={a.icon} size={13} strokeWidth={1.8}/>
                    {a.name}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Note (optional)">
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="What is it for?"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                background: tokens.paper, border: `1px solid ${tokens.hairline}`,
                fontSize: 14, fontFamily: 'inherit', color: tokens.ink,
                outline: 'none',
              }}
            />
          </Field>
        </div>

        {/* Save button */}
        <button onClick={onClose} disabled={!amount} style={{
          width: '100%', marginTop: 14, padding: '14px', borderRadius: 14,
          background: amount ? tint : tokens.divider,
          color: amount ? '#fff' : tokens.muted,
          border: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          cursor: amount ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={16} color={amount ? '#fff' : tokens.muted} strokeWidth={2.2}/>
          Save {type}
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </>
  );
}

function Field({ label, rightHint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: tokens.muted, textTransform: 'uppercase' }}>{label}</span>
        {rightHint && <span style={{ fontSize: 11, color: tokens.faint }}>{rightHint}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Mount ───────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
