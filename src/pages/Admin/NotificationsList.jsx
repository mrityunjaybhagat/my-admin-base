import React, { useState } from "react";
import { Bell, Package, CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";

// UI only — replace MOCK_NOTIFICATIONS with a real fetch once the
// backend exists. `type` drives the icon/color; add more as needed.
const ICONS = {
  info: Bell,
  low_stock: AlertTriangle,
  payment: CreditCard,
  stock: Package,
  success: CheckCircle2,
};

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "low_stock", title: "Low stock alert", message: "Sofy Antibacteria XL 7P has dropped to 12 units, below its reorder level.", time: "2h ago", read: false },
  { id: 2, type: "payment", title: "Payment received", message: "₹5,092.68 received against invoice A000407.", time: "5h ago", read: false },
  { id: 3, type: "stock", title: "Purchase received", message: "Purchase P000014 added 200 units of MamyPoko Pants Standard S1 to stock.", time: "1d ago", read: true },
  { id: 4, type: "success", title: "Invoice paid in full", message: "Invoice A000398 is now marked Paid.", time: "2d ago", read: true },
];

export default function NotificationsList() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      <div className="filter-row">
        <button
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("unread")}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="table-card">
        {visible.length === 0 && <div className="empty-state">Nothing here.</div>}
        {visible.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <div
              key={n.id}
              className="notification-row"
              onClick={() => markRead(n.id)}
              style={{ background: n.read ? "transparent" : "#FBF8F2" }}
            >
              <div className={`notification-icon notification-icon-${n.type}`}>
                <Icon size={16} strokeWidth={2} />
              </div>
              <div className="notification-body">
                <div className="notification-title">
                  {n.title}
                  {!n.read && <span className="status-dot" style={{ marginLeft: 8, background: "var(--rust)" }} />}
                </div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}