import React, { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder, multiple }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  const selected = multiple
    ? (value || []).map(v => options.find(o => o.value === v)).filter(Boolean)
    : options.find(o => o.value === value);

  const toggle = (opt) => {
    if (multiple) {
      const cur = value || [];
      onChange(cur.includes(opt.value) ? cur.filter(v => v !== opt.value) : [...cur, opt.value]);
    } else {
      onChange(opt.value);
      setOpen(false);
      setQuery('');
    }
  };

  const removeTag = (v, e) => { e.stopPropagation(); onChange((value || []).filter(x => x !== v)); };

  return (
    <div className="sel-wrap" ref={ref}>
      <div className={`sel-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        {multiple ? (
          <div className="sel-tags">
            {selected.length === 0 && <span className="sel-placeholder">{placeholder}</span>}
            {selected.map(s => (
              <span key={s.value} className="sel-tag">{s.label}<button onClick={(e) => removeTag(s.value, e)}>×</button></span>
            ))}
          </div>
        ) : (
          <span className={selected ? '' : 'sel-placeholder'}>{selected ? selected.label : placeholder}</span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`sel-arrow ${open ? 'up' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <div className="sel-dropdown">
          <input className="sel-search" placeholder="Tìm kiếm..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          {filtered.length === 0 ? (
            <div className="sel-empty">Không tìm thấy kết quả</div>
          ) : (
            filtered.map(opt => (
              <div key={opt.value} className={`sel-option ${multiple && (value||[]).includes(opt.value) ? 'selected' : ''} ${!multiple && value === opt.value ? 'selected' : ''}`} onClick={() => toggle(opt)}>
                {multiple && <span className="sel-check">{(value||[]).includes(opt.value) ? '✓' : ''}</span>}
                {opt.label}
                {opt.unit && <span className="sel-unit">{opt.unit}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}