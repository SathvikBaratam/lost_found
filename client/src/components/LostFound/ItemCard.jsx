import "./styles/ItemCard.css";
import StatusBadge from "./StatusBadge";

export default function ItemCard({ item, onClick }) {
  return (
    <div className="item-card" onClick={() => onClick(item)}>
      <div className="item-card-body">
        <h3>{item.name}</h3>
        <StatusBadge status={item.status} />
        <p>{item.location}</p>
        <span>{new Date(item.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
