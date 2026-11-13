import "./styles/FilterBar.css";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="filter-bar">
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="all">All</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="documents">Documents</option>
        <option value="accessories">Accessories</option>
      </select>
    </div>
  );
}
