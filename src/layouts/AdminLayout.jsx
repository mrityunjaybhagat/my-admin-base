import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import CrudModule from "../components/crud/CrudModal";
export default function AdminLayout() {
  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "true"); 
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  }; 
  return (
    <>
      <div className="app-shell">
        <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        />
        <div className="content">
          <Outlet />
        </div>
        <Toast message={toast} />
      </div>
    </>
  );
}
