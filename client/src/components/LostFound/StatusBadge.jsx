import "./styles/StatusBadge.css";

export default function StatusBadge({ status }) {
  const colors = { lost: "#E8A33D", found: "#3E7C59", resolved: "#8B8680" };
  return (
    <span className="status-badge" style={{ background: colors[status] }}>
      {status.toUpperCase()}
    </span>
  );
}
