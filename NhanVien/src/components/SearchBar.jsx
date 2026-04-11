import './SearchBar.css';

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SearchBar = ({ value, onChange }) => (
  <div className="sb-wrap">
    <span className="sb-icon"><IconSearch /></span>
    <input
      className="sb-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Tìm kiếm theo mã đặt trước"
    />
    {value && (
      <button className="sb-clear" onClick={() => onChange('')}>✕</button>
    )}
  </div>
);

export default SearchBar;