import React from "react";
import { ChevronLeft } from "lucide-react";

export default function FormShell({ title, onBack, onSave, saveLabel = "Save", saving = false, children }) {
  return (
    <div className="form-shell">
      <button className="link-btn" onClick={onBack}><ChevronLeft size={15} /> Back</button>
      <h1 className="page-title" style={{ marginBottom: 20 }}>{title}</h1>
      <div className="form-stack">{children}</div>
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : saveLabel}
      </button>
    </div>
  );
}
