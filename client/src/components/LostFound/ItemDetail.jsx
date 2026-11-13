import "./styles/ItemDetail.css";
import StatusBadge from "./StatusBadge";

export default function ItemDetail({ item, onClaim, onClose }) {
  return (
    <div className="item-detail-overlay" onClick={onClose}>
      <div className="item-detail" onClick={(e) => e.stopPropagation()}>
        <h2>{item.name}</h2>
        <StatusBadge status={item.status} />
        <p>{item.description}</p>
        <p>Location: {item.location}</p>
        <p>Reported by: {item.reporterName}</p>
        <button onClick={() => onClaim(item)}>Claim / Contact</button>
      </div>
    </div>
  );
}
