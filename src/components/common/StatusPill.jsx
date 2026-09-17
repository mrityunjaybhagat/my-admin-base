import React from "react";

const CONFIG = {
  published: { className: "published", label: "Published" },
  draft: { className: "draft", label: "Draft" },
};

export default function StatusPill({ status }) {
  const cfg = CONFIG[status] || CONFIG.draft;
  return (
    <span className={`status-pill ${cfg.className}`}>
      <span className="status-dot" />
      {cfg.label}
    </span>
  );
}
