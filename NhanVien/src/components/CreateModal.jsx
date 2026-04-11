import { useState, useEffect } from 'react';
import Icons from './Icons';
import { ADDRESS_DATA, DAN_TOC, GIOI_TINH, EMPTY_FORM } from '../data/mockData';

const CreateModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [huyenList, setHuyenList] = useState([]);
  const [xaList, setXaList] = useState([]);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    if (form.tinh) {
      setHuyenList(Object.keys(ADDRESS_DATA[form.tinh] || {}));
      setForm((prev) => ({ ...prev, huyen: '', xa: '' }));
      setXaList([]);
    } else {
      setHuyenList([]);
      setXaList([]);
    }
  }, [form.tinh]);

  useEffect(() => {
    if (form.tinh && form.huyen) {
      setXaList(ADDRESS_DATA[form.tinh]?.[form.huyen] || []);
      setForm((prev) => ({ ...prev, xa: '' }));
    } else {
      setXaList([]);
    }
  }, [form.huyen]);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Vui lòng nhập họ và tên';
    if (!form.dob) err.dob = 'Vui lòng nhập ngày sinh';
    if (!form.phone.trim()) err.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^\d{9,11}$/.test(form.phone.trim())) err.phone = 'Số điện thoại không hợp lệ';
    return err;
  };

  const handleSubmit = () => {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    const addressParts = [form.xa, form.huyen, form.tinh, form.diaChi].filter(Boolean);
    onSubmit({ ...form, address: addressParts.join(', ') || 'Đang cập nhật' });
  };

  return (
    <div className="sdp-modal-overlay" onClick={onClose}>
      <div className="sdp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sdp-modal-header">
          <span className="sdp-modal-title">Tạo hồ sơ bệnh nhân</span>
          <button className="sdp-modal-close" onClick={onClose}><Icons.Close /></button>
        </div>
        <div className="sdp-modal-body">
          <div className="sdp-form-group">
            <input className={`sdp-form-input ${errors.name ? 'error' : ''}`} placeholder="Họ và tên *" value={form.name} onChange={set('name')} />
            {errors.name && <span className="sdp-form-error">{errors.name}</span>}
          </div>
          <div className="sdp-form-group">
            <input type="date" className={`sdp-form-input ${errors.dob ? 'error' : ''}`} value={form.dob} onChange={set('dob')} />
            {errors.dob && <span className="sdp-form-error">{errors.dob}</span>}
          </div>
          <div className="sdp-form-row">
            <div className="sdp-form-group">
              <input className={`sdp-form-input ${errors.phone ? 'error' : ''}`} placeholder="Số điện thoại *" value={form.phone} onChange={set('phone')} maxLength={11} />
              {errors.phone && <span className="sdp-form-error">{errors.phone}</span>}
            </div>
            <div className="sdp-form-group">
              <input className="sdp-form-input" placeholder="Nhập số CCCD/CMND *" value={form.cccd} onChange={set('cccd')} maxLength={12} />
            </div>
          </div>
          <div className="sdp-form-row">
            <div className="sdp-form-group">
              <select className="sdp-form-select" value={form.danToc} onChange={set('danToc')}>
                <option value="">Dân tộc</option>
                {DAN_TOC.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
            <div className="sdp-form-group">
              <select className="sdp-form-select" value={form.gioiTinh} onChange={set('gioiTinh')}>
                <option value="">Giới tính</option>
                {GIOI_TINH.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="sdp-form-group">
            <select className="sdp-form-select" value={form.tinh} onChange={set('tinh')}>
              <option value="">Tỉnh/Thành phố</option>
              {Object.keys(ADDRESS_DATA).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="sdp-form-group">
            <select className="sdp-form-select" value={form.huyen} onChange={set('huyen')} disabled={!huyenList.length}>
              <option value="">Quận/Huyện</option>
              {huyenList.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="sdp-form-group">
            <select className="sdp-form-select" value={form.xa} onChange={set('xa')} disabled={!xaList.length}>
              <option value="">Phường/Xã</option>
              {xaList.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div className="sdp-form-group">
            <input className="sdp-form-input" placeholder="Nhập địa chỉ" value={form.diaChi} onChange={set('diaChi')} />
          </div>
        </div>
        <div className="sdp-modal-footer">
          <button className="sdp-btn-submit" onClick={handleSubmit}>TẠO</button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;