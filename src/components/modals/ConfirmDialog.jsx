import React from "react";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirming = false }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-title">{title}</div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={confirming}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={confirming}>
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
