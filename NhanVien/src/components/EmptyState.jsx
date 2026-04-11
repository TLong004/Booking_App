import './EmptyState.css';

/* Con mèo SVG đơn giản, gần giống ảnh gốc */
const CatSVG = () => (
  <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="es-cat">
    {/* body */}
    <ellipse cx="60" cy="90" rx="30" ry="28" fill="#c5d8f0"/>
    {/* head */}
    <ellipse cx="60" cy="56" rx="26" ry="24" fill="#c5d8f0"/>
    {/* ears */}
    <polygon points="38,38 32,18 50,34" fill="#c5d8f0"/>
    <polygon points="82,38 88,18 70,34" fill="#c5d8f0"/>
    <polygon points="40,37 35,22 50,34" fill="#f8a4b0"/>
    <polygon points="80,37 85,22 70,34" fill="#f8a4b0"/>
    {/* eyes - left */}
    <ellipse cx="51" cy="55" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="51" cy="56" rx="3" ry="4" fill="#4a9ed8"/>
    <ellipse cx="51" cy="56" rx="1.5" ry="2.5" fill="#1a1a2e"/>
    {/* eyes - right */}
    <ellipse cx="69" cy="55" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="69" cy="56" rx="3" ry="4" fill="#4a9ed8"/>
    <ellipse cx="69" cy="56" rx="1.5" ry="2.5" fill="#1a1a2e"/>
    {/* tears */}
    <path d="M50 62 Q49 67 51 70" stroke="#7ec8e3" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M70 62 Q71 67 69 70" stroke="#7ec8e3" strokeWidth="1.5" strokeLinecap="round"/>
    {/* nose */}
    <ellipse cx="60" cy="65" rx="2" ry="1.5" fill="#f8a4b0"/>
    {/* mouth */}
    <path d="M56 68 Q60 72 64 68" stroke="#999" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    {/* magnifying glass */}
    <circle cx="82" cy="80" r="12" stroke="#7ba7cc" strokeWidth="3" fill="rgba(255,255,255,0.6)"/>
    <line x1="91" y1="89" x2="100" y2="100" stroke="#7ba7cc" strokeWidth="3.5" strokeLinecap="round"/>
    {/* paws */}
    <ellipse cx="42" cy="112" rx="10" ry="7" fill="#b0c8e8"/>
    <ellipse cx="78" cy="112" rx="10" ry="7" fill="#b0c8e8"/>
    {/* blush */}
    <ellipse cx="44" cy="66" rx="5" ry="3" fill="#f8a4b0" opacity="0.5"/>
    <ellipse cx="76" cy="66" rx="5" ry="3" fill="#f8a4b0" opacity="0.5"/>
  </svg>
);

const EmptyState = ({ message = 'Không tìm thấy kết quả nào phù hợp' }) => (
  <div className="es-wrap">
    <div className="es-bg-circle">
      <CatSVG />
    </div>
    <p className="es-text">{message}</p>
  </div>
);

export default EmptyState;