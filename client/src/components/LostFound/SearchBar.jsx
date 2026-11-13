import "./styles/SearchBar.css";

export default function SearchBar({ value, onSearch }) {
  return (
    <input
      className="search-bar"
      placeholder="Search items..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
