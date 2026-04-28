import React from 'react';
import SearchableSelect from './SearchableSelect';

export default function PrescriptionRow({ item, index, onChange, onRemove, medicines }) {
  return (
    <div className="rx-row">
      <div className="rx-num">{index + 1}</div>
      <div className="rx-fields">
        <SearchableSelect
          options={medicines}
          value={item.medicine_id}
          onChange={v => onChange(index, 'medicine_id', v)}
          placeholder="Chọn thuốc..."
        />
        <input className="field" type="number" min="1" placeholder="SL" value={item.quantity || ''} onChange={e => onChange(index, 'quantity', e.target.value)} style={{width: 64}} />
        <input className="field" placeholder="Liều dùng (VD: Sáng 1, Tối 1)" value={item.dosage || ''} onChange={e => onChange(index, 'dosage', e.target.value)} style={{flex:1.2}} />
        <input className="field" placeholder="Cách dùng (VD: Sau ăn)" value={item.usage || ''} onChange={e => onChange(index, 'usage', e.target.value)} style={{flex:1}} />
      </div>
      <button className="rx-remove" onClick={() => onRemove(index)} title="Xóa">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}