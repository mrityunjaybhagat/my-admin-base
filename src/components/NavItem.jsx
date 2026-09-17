import React from "react";
import { NavLink } from "react-router-dom";

export default function NavItem({ icon: Icon, label, to, end, count, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `nav-item${isActive ? " active" : ""}${collapsed ? " collapsed" : ""}`}
    >
      <Icon size={17} strokeWidth={1.8} />
      {!collapsed && <span className="nav-item-label">{label}</span>}
      {!collapsed && count != null && <span className="nav-item-count">{count}</span>}
    </NavLink>
  );
}
