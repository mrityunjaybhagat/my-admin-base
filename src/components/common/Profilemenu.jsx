import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Bell, LogOut } from "lucide-react";


import { logout } from "../../api/auth.js";
import FormDrawer from "./FormDrawer.jsx";
import ChangePasswordForm from "../../pages/Users/ChangePasswordForm.jsx";

// Drop into Sidebar.jsx in place of the current static avatar+name block:
//   <ProfileMenu user={currentUser} onLogout={() => setUser(null)} />
// `user` should be whatever App.jsx already stores from the login
// response (it currently keeps { email } at minimum).
export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    try { await logout(); } catch { /* proceed to clear local state regardless */ }
    onLogout?.();
  };

  return (
    <div className="profile-menu" ref={ref}>
      <button className="sidebar-footer" style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        <div className="avatar">{initial}</div>
        <div className="sidebar-footer-name">{user?.name || user?.email || "Account"}</div>
      </button>

      {open && (
        <div className="profile-menu-panel">
          <div className="profile-menu-header">
            <div className="profile-menu-name">{user?.name || "Signed in"}</div>
            {user?.email && <div className="profile-menu-email">{user.email}</div>}
          </div>
          <button className="profile-menu-item" onClick={() => { setOpen(false); setChangePasswordOpen(true); }}>
            <Lock size={14} /> Change Password
          </button>
          <button className="profile-menu-item" onClick={() => { setOpen(false); navigate("/admin/notifications"); }}>
            <Bell size={14} /> Notifications
          </button>
          <button className="profile-menu-item danger" onClick={handleLogout}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}

      <FormDrawer open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} title="Change Password">
        <ChangePasswordForm onCancel={() => setChangePasswordOpen(false)} onSuccess={() => setChangePasswordOpen(false)} />
      </FormDrawer>
    </div>
  );
}