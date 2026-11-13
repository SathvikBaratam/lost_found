import "./styles/ItemGrid.css";
import ItemCard from "./ItemCard";

export function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}

export default function ItemGrid({ items, onItemClick }) {
  if (!items.length) return <EmptyState message="No items found" />;
  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
