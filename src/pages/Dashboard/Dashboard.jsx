import react from "react";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const stats = [
    { label: "Published Posts", value:100 },
    { label: "Drafts", value: 50 },
    { label: "Categories", value: 10 },
    { label: "Magazine Issues", value: 5 },
  ];
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="dashboard">
        <h1 className="page-title" style={{ fontSize: 30 }}>
          Good afternoon, Editor.
        </h1>
        <p className="page-sub" style={{ marginBottom: 26 }}>
          Here's where the Chronicle stands today.
        </p>
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
