import './QueueTable.css';

const STATUS_CLASS = {
  'Đang chờ':  'qt-status--waiting',
  'Đang khám': 'qt-status--active',
  'Đã khám':   'qt-status--done',
};

const QueueTable = ({ rows }) => (
  <div className="qt-wrap">
    <table className="qt-table">
      <thead>
        <tr>
          <th className="qt-th qt-col-stt">STT</th>
          <th className="qt-th qt-col-ma">Mã đặt trước</th>
          <th className="qt-th qt-col-ten">Họ tên</th>
          <th className="qt-th qt-col-gt">Giới tính</th>
          <th className="qt-th qt-col-ns">Ngày sinh</th>
          <th className="qt-th qt-col-sdt">Số điện thoại</th>
          <th className="qt-th qt-col-tt">Trạng thái</th>
          <th className="qt-th qt-col-act"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.ma} className="qt-tr">
            <td className="qt-td qt-col-stt">
              <span className="qt-stt">{String(r.stt).padStart(2, '0')}</span>
            </td>
            <td className="qt-td qt-col-ma">
              <span className="qt-ma">{r.ma}</span>
            </td>
            <td className="qt-td qt-col-ten">
              <span className="qt-ten">{r.hoTen}</span>
            </td>
            <td className="qt-td qt-col-gt">{r.gioiTinh}</td>
            <td className="qt-td qt-col-ns">{r.ngaySinh}</td>
            <td className="qt-td qt-col-sdt">{r.sdt}</td>
            <td className="qt-td qt-col-tt">
              <span className={`qt-status ${STATUS_CLASS[r.trangThai] || ''}`}>
                {r.trangThai}
              </span>
            </td>
            <td className="qt-td qt-col-act">
              <button className="qt-btn-call">Gọi vào</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default QueueTable;