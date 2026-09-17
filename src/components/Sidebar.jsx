import React from "react";
//import { TramFront, LayoutGrid, FileText, FolderOpen, BookImage, Files, Users, Package, Receipt, Truck, ShoppingCart, Boxes, ChevronLeft, Settings } from "lucide-react";
import NavItem from "./NavItem.jsx";
import {
  LayoutGrid,
  FileText,
  FolderOpen,
  BookImage,
  Files,
  Users,
  Package,
  Receipt,
  Truck,
  ShoppingCart,
  Boxes,
  WalletCards,
  Banknote,
  BookOpenCheck,
  Settings,
  ChevronLeft,
  TramFront,
  CircleDollarSign,
  ChartNoAxesCombined
} from "lucide-react";

export default function Sidebar({ counts, collapsed, onToggle }) {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },

    // { to: "/admin/posts", label: "Posts", icon: FileText, count: 10 },
    // { to: "/admin/categories", label: "Categories", icon: FolderOpen, count: 10 },
    // { to: "/admin/magazines", label: "Magazines", icon: BookImage, count: 10 },
    // { to: "/admin/pages", label: "Pages", icon: Files, count: 10 },

    { to: "/admin/customers", label: "Customers", icon: Users, count: 10 },
    { to: "/admin/suppliers", label: "Suppliers", icon: Truck, count: 10 },
    { to: "/admin/products", label: "Products", icon: Package, count: 10 },

    { to: "/admin/invoices", label: "Invoices", icon: Receipt, count: 10 },
    { to: "/admin/payments", label: "Payments Received", icon: CircleDollarSign },

    { to: "/admin/purchases", label: "Purchases", icon: ShoppingCart, count: 10 },
    { to: "/admin/supplier-payments", label: "Supplier Payments", icon: CircleDollarSign },

    { to: "/admin/expenses", label: "Expenses", icon: WalletCards, count: 10 },
    { to: "/admin/cash-vouchers", label: "Cash Vouchers", icon: Banknote, count: 10 },

    { to: "/admin/stock", label: "Stock", icon: Boxes },

    { to: "/admin/ledgers", label: "Ledgers", icon: BookOpenCheck },
    { to: "/admin/reports", label: "Reports", icon: ChartNoAxesCombined },

    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft size={13} strokeWidth={2.5} />
      </button>

      <div className="sidebar-header">
        <div className="sidebar-brand">
          <TramFront size={18} color="var(--tram)" strokeWidth={2} />
          {!collapsed && <span className="sidebar-brand-text">Calcutta Chronicle</span>}
        </div>
        {!collapsed && <div className="sidebar-sub">EDITORIAL DESK</div>}
      </div>

      <div className="nav">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            end={item.end}
            count={item.count}
            collapsed={collapsed}
          />
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="avatar">E</div>
        {!collapsed && <div className="sidebar-footer-name">Editor</div>}
      </div>
    </div>
  );
}