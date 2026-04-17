/* global React */
const { useState } = React;

// ICON SET — Lucide-style stroke icons, 1.5px
window.Ico = function Ico({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    transfer:  <><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></>,
    inventory: <><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><rect x="2" y="9" width="20" height="13" rx="2"/></>,
    report:    <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></>,
    product:   <><path d="m7.5 4.27 9 5.15"/><path d="M21 8 12 13 3 8l9-5 9 5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 22.08V12"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
    add:       <><path d="M5 12h14"/><path d="M12 5v14"/></>,
    arrow:     <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    check:     <path d="M20 6 9 17l-5-5"/>,
    x:         <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    lock:      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    truck:     <><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    alert:     <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
    pulse:     <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    sparkles:  <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    snow:      <><path d="M2 12h20"/><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></>,
    chevron:   <path d="m9 18 6-6-6-6"/>,
    chevdown:  <path d="m6 9 6 6 6-6"/>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    refresh:   <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    file:      <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></>,
    globe:     <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    dot:       <circle cx="12" cy="12" r="3"/>,
    external:  <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></>,
    flask:     <><path d="M9 3h6"/><path d="M10 3v4.5a2 2 0 0 1-.3 1.1L5 16a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-4.7-7.4a2 2 0 0 1-.3-1.1V3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths[name]}</svg>;
};

window.Button = function Button({ variant = 'primary', size = 'md', children, onClick, icon, disabled, full }) {
  const base = {
    fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.005em',
    borderRadius: size === 'sm' ? 8 : 10,
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 22px' : '9px 16px',
    fontSize: size === 'sm' ? 12.5 : size === 'lg' ? 15 : 13.5,
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    opacity: disabled ? 0.4 : 1, width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
  };
  const v = {
    primary:   { background: '#A06090', color: '#FFF', boxShadow: '0 1px 2px rgba(21,21,26,0.06), 0 0 0 1px rgba(140,79,126,0.1)' },
    secondary: { background: '#FFFFFF', color: '#15151A', borderColor: '#E8E8ED', boxShadow: '0 1px 2px rgba(21,21,26,0.03)' },
    ghost:     { background: 'transparent', color: '#3E3E48' },
    ghostMauve:{ background: 'transparent', color: '#A06090' },
    danger:    { background: '#FFFFFF', color: '#C4314B', borderColor: '#F0C9CF' },
    success:   { background: '#0F8A5F', color: '#FFF' },
    dark:      { background: '#15151A', color: '#FFF' },
  }[variant];
  return <button style={{ ...base, ...v }} onClick={onClick} disabled={disabled}>{icon}{children}</button>;
};

window.Badge = function Badge({ tone = 'neutral', children, dot = true, size = 'md' }) {
  const tones = {
    success: { bg: '#E4F5EC', fg: '#0F8A5F' },
    warning: { bg: '#FBF0DB', fg: '#B87300' },
    danger:  { bg: '#FBE6EA', fg: '#C4314B' },
    info:    { bg: '#E5EEFA', fg: '#2F6BCC' },
    brand:   { bg: '#FAF2F7', fg: '#8C4F7E' },
    neutral: { bg: '#F1F1F4', fg: '#3E3E48' },
    dark:    { bg: '#15151A', fg: '#FFF' },
  }[tone];
  const small = size === 'sm';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: small ? '2px 8px' : '3px 10px', borderRadius: 999, fontSize: small ? 11 : 11.5, fontWeight: 500, background: tones.bg, color: tones.fg, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: 999, background: tones.fg }} />}{children}
  </span>;
};

// Country flag pill
window.CountryTag = function CountryTag({ code, countries, size = 'md' }) {
  const c = countries.find(x => x.code === code);
  if (!c) return null;
  const small = size === 'sm';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: small ? '2px 8px 2px 6px' : '3px 10px 3px 7px', borderRadius: 999, background: '#F7F7F9', border: '1px solid #E8E8ED', fontSize: small ? 11 : 12, fontWeight: 500, color: '#15151A', whiteSpace: 'nowrap' }}>
    <span style={{ fontSize: small ? 12 : 13 }}>{c.flag}</span>{c.code}
  </span>;
};

// Lock icon with read-only tooltip
window.LockTooltip = function LockTooltip({ country }) {
  return <span title={`Read-only — owned by ${country}`} style={{ display: 'inline-flex', alignItems: 'center', color: '#B8B8C2', cursor: 'help' }}>
    <Ico name="lock" size={12} />
  </span>;
};

window.Card = function Card({ children, padding = 24, style = {} }) {
  return <div style={{ background: '#FFF', border: '1px solid #E8E8ED', borderRadius: 14, padding, boxShadow: '0 1px 2px rgba(21,21,26,0.04)', ...style }}>{children}</div>;
};

window.SectionHead = function SectionHead({ title, action, overline }) {
  return <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
    <div>
      {overline && <div style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A9AA6', fontWeight: 500, marginBottom: 6 }}>{overline}</div>}
      <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: '#15151A', margin: 0 }}>{title}</h2>
    </div>
    {action}
  </div>;
};
