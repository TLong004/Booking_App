import Icons from './Icons';

const PatientCard = ({ patient, onAccept }) => (
  <div className="sdp-card">
    <div className="sdp-card-header">
      <span className="sdp-card-title">Thông tin bệnh nhân</span>
      <span className="sdp-card-badge">{patient.id}</span>
    </div>
    <div className="sdp-card-body">
      {[
        { icon: <Icons.ID />, label: 'Mã bệnh nhân', value: patient.id },
        { icon: <Icons.User />, label: 'Họ và tên', value: patient.name },
        { icon: <Icons.Gender />, label: 'Giới tính', value: patient.gender },
        { icon: <Icons.Calendar />, label: 'Ngày sinh', value: patient.dob },
        { icon: <Icons.Phone />, label: 'Số điện thoại', value: patient.phone },
        { icon: <Icons.Card />, label: 'CCCD/CMND', value: patient.cccd },
        { icon: <Icons.Location />, label: 'Địa chỉ', value: patient.address },
      ].map(({ icon, label, value }) => (
        <div key={label} className="sdp-card-row">
          <span className="sdp-card-row-label">
            <span className="sdp-card-row-icon">{icon}</span>
            {label}:
          </span>
          <span className="sdp-card-row-value">{value}</span>
        </div>
      ))}
    </div>
    <div className="sdp-card-footer">
      {patient.accepted ? (
        <span className="sdp-accepted-chip"><Icons.Check /> Đã tiếp nhận</span>
      ) : (
        <button className="sdp-btn-accept" onClick={() => onAccept(patient)}>
          Tiếp nhận
        </button>
      )}
    </div>
  </div>
);

export default PatientCard;