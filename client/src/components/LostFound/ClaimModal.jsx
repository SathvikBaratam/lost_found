import "./styles/ClaimModal.css";

export default function ClaimModal({ item, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Claim This Item</h3>
        <p>
          <strong>Item:</strong> {item.name}
        </p>
        <p>
          <strong>Status:</strong> {item.status}
        </p>
        <p>
          <strong>Reporter:</strong> {item.reporterName}
        </p>
        <p style={{ marginTop: "16px", color: "#6B6F8C", fontSize: "0.9rem" }}>
          This will notify the reporter that you're claiming this item.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={() => onConfirm(item)} className="confirm-btn">
            Confirm Claim
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
