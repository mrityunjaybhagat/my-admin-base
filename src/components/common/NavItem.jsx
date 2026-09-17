import React from "react";
import { NavLink } from "react-router-dom";

export default function NavItem({ icon: Icon, label, to, end, count }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
    >
      <Icon size={17} strokeWidth={1.8} />
      <span className="nav-item-label">{label}</span>
      {count != null && <span className="nav-item-count">{count}</span>}
    </NavLink>
  );
}
