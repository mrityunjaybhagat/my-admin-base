import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PagesList() {
  const { pages } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">Pages</h1>
      <p className="page-sub">Static pages — same editor as Posts, so content can mix text and images too.</p>
      <div className="grid-cards">
        {pages.map((p) => (
          <button key={p.id} className="grid-card clickable" onClick={() => navigate(`/admin/pages/${p.id}/edit`)}>
            <div className="grid-card-body">
              <div className="grid-card-title">{p.title}</div>
              <div className="grid-card-meta">Click to edit</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
