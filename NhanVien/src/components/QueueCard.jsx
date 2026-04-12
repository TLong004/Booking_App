// src/components/QueueCard.jsx

const STATUS_LABEL = {
  done:    'Đã khám',
  waiting: 'Chờ khám',
};

const QueueCard = ({ ticket, index, isActive, onSelect }) => (
  <button
    className={`mep-queue-card ${isActive ? 'active' : ''}`}
    onClick={() => onSelect(ticket)}
  >
    <div className="mep-queue-num">{index + 1}</div>
    <div className="mep-queue-info">
      <div className="mep-queue-id">{ticket.id}</div>
      <div className="mep-queue-name">{ticket.patient.name}</div>
      <div className="mep-queue-time">{ticket.confirmedAt}</div>
    </div>
    {ticket.status && (
      <span className={`mep-queue-status ${ticket.status}`}>
        {STATUS_LABEL[ticket.status] ?? ticket.status}
      </span>
    )}
  </button>
);

export default QueueCard;