// ui.jsx — Shared UI primitives: icons, cards, chips, sparkline.

// Inline SVG icon set. Keep them simple, stroked, 1.6px weight.
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) => {
  const s = size;
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':       return <svg {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case 'list':       return <svg {...p}><path d="M4 7h16M4 12h16M4 17h10"/></svg>;
    case 'chart':      return <svg {...p}><path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>;
    case 'more':       return <svg {...p}><circle cx="5" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.4" fill={color} stroke="none"/><circle cx="19" cy="12" r="1.4" fill={color} stroke="none"/></svg>;
    case 'plus':       return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'arrow-up':   return <svg {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-down': return <svg {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'arrow-right':return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-lr':   return <svg {...p}><path d="M7 7l-3 5 3 5M17 7l3 5-3 5M4 12h16"/></svg>;
    case 'bank':       return <svg {...p}><path d="M3 10h18L12 3 3 10z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>;
    case 'cash':       return <svg {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>;
    case 'mobile':     return <svg {...p}><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>;
    case 'cart':       return <svg {...p}><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M3 4h2l2.4 11h11l1.6-8H6"/></svg>;
    case 'family':     return <svg {...p}><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M14 20c0-2 1.4-4 3-4s3 1.5 3 4"/></svg>;
    case 'bag':        return <svg {...p}><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>;
    case 'bus':        return <svg {...p}><rect x="4" y="4" width="16" height="14" rx="2"/><path d="M4 12h16"/><circle cx="8" cy="20" r="1.3"/><circle cx="16" cy="20" r="1.3"/></svg>;
    case 'health':     return <svg {...p}><path d="M12 21s-7-4.5-7-10.5A4.5 4.5 0 0112 6a4.5 4.5 0 017 4.5C19 16.5 12 21 12 21z"/><path d="M10 11h4M12 9v4"/></svg>;
    case 'gift':       return <svg {...p}><rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8s-3-5-5-3-2 4 5 3zM12 8s3-5 5-3 2 4-5 3z"/></svg>;
    case 'food':       return <svg {...p}><path d="M5 3v8a3 3 0 003 3v7M8 3v6M5 6h3M16 3c-1.5 0-3 2-3 5s1.5 5 3 5v8"/></svg>;
    case 'bill':       return <svg {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>;
    case 'other':      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h0"/></svg>;
    case 'salary':     return <svg {...p}><path d="M4 7h16v10H4z"/><circle cx="12" cy="12" r="2.5"/><path d="M7 7v10M17 7v10"/></svg>;
    case 'search':     return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>;
    case 'bell':       return <svg {...p}><path d="M6 16V11a6 6 0 1112 0v5l2 2H4l2-2z"/><path d="M10 20a2 2 0 004 0"/></svg>;
    case 'settings':   return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
    case 'logout':     return <svg {...p}><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'note':       return <svg {...p}><path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/><path d="M7 13h8M7 17h6"/></svg>;
    case 'pin':        return <svg {...p}><path d="M12 2l3 6 5 1-4 4 1 6-5-3-5 3 1-6-4-4 5-1z"/></svg>;
    case 'check':      return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'x':          return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'edit':       return <svg {...p}><path d="M4 20h4l11-11-4-4L4 16v4z"/></svg>;
    case 'trash':      return <svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case 'filter':     return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'calendar':   return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'menu':       return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case 'loan':       return <svg {...p}><path d="M3 6h18v12H3z"/><circle cx="12" cy="12" r="2.5"/><path d="M6 6v12M18 6v12"/></svg>;
    case 'receive':    return <svg {...p}><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>;
    case 'send':       return <svg {...p}><path d="M12 20V8M6 14l6-6 6 6M4 4h16"/></svg>;
    case 'wallet':     return <svg {...p}><path d="M3 7v12a2 2 0 002 2h15V9H5a2 2 0 01-2-2z"/><path d="M5 7V5a2 2 0 012-2h11v4M17 13h3"/></svg>;
    case 'eye':        return <svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':    return <svg {...p}><path d="M3 3l18 18M10.6 6.1A10 10 0 0112 6c6 0 10 6 10 6a16 16 0 01-3.4 4M6 7a16 16 0 00-4 5s4 6 10 6c1.6 0 3-.3 4.3-.9"/></svg>;
    default: return null;
  }
};

// Category → icon map
const CAT_ICON = {
  Salary: 'salary', Family: 'family', Groceries: 'cart',
  Shopping: 'bag', Transport: 'bus', Health: 'health',
  Gifts: 'gift', Restaurant: 'food', Bills: 'bill', Other: 'other',
};

// Small inline sparkline for the balance card
function Sparkline({ data, width = 100, height = 28, color = '#16161a' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Category pill — small chip showing category name + dot
function CatChip({ name }) {
  const c = tokens.cat[name] || tokens.muted;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      background: '#fff', border: `1px solid ${tokens.hairline}`,
      fontSize: 11, fontWeight: 500, color: tokens.ink2, letterSpacing: '.01em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c }}/>
      {name}
    </span>
  );
}

// Category icon disc — used in transaction rows / budget grid
function CatDisc({ name, size = 36, soft = true }) {
  const color = tokens.cat[name] || tokens.muted;
  const bg = soft ? hexAlpha(color, 0.10) : color;
  const fg = soft ? color : '#fff';
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon name={CAT_ICON[name] || 'other'} size={Math.round(size * 0.5)} strokeWidth={1.7}/>
    </div>
  );
}

// Hex w/ alpha
function hexAlpha(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Compact section header with optional action
function SectionHead({ title, action, onAction }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '4px 4px 10px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', color: tokens.muted, textTransform: 'uppercase' }}>{title}</div>
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: 0, padding: 0, color: tokens.ink2,
          fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {action}
          <Icon name="arrow-right" size={12}/>
        </button>
      )}
    </div>
  );
}

// Card shell — white, hairline border, subtle shadow
function Card({ children, style, onClick, padding = 16 }) {
  return (
    <div onClick={onClick} style={{
      background: tokens.paper, borderRadius: 18,
      border: `1px solid ${tokens.hairline}`,
      padding,
      boxShadow: '0 1px 0 rgba(22,22,26,0.02), 0 4px 16px -8px rgba(22,22,26,0.05)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { Icon, CAT_ICON, Sparkline, CatChip, CatDisc, hexAlpha, SectionHead, Card });
