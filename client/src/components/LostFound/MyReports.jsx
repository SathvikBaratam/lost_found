import "./styles/MyReports.css";
import StatusBadge from "./StatusBadge";

export default function MyReports({ items, onEdit, onDelete, onResolve }) {
  return (
    <div className="my-reports">
      {items.map((item) => (
        <div key={item.id} className="my-report-row">
          <span>{item.name}</span>
          <StatusBadge status={item.status} />
          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onResolve(item.id)}>Mark Resolved</button>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
