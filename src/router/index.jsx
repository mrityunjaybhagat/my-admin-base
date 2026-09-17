import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProductsList from "../pages/Dashboard/ProductsList";
import CustomersList from "../pages/Customers/CustomerList";
import NotFound from "../pages/NotFound";
import InvoicesList from "../pages/InvoicesList/InvoicesList";
import SupplierList from "../pages/Suppliers/SupplierList.jsx";

import StockList from "../pages/Stock/StockList.jsx";
import ExpenseList from "../pages/Expenses/ExpenseList.jsx";
import PaymentsList from "../pages/Payments/PaymentsList.jsx";
import PaymentReceivedList from "../pages/Payments/PaymentReceivedList.jsx";
import CashVoucherList from "../pages/CashVouchers/CashVoucherList.jsx";
import PurchaseList from "../pages/Purchases/PurchaseList.jsx";

import CustomerLedgerView from "../pages/Ledgers/CustomerLedgerView.jsx";
import SupplierLedgerView from "../pages/Ledgers/SupplierLedgerView.jsx";
import CashBankLedgerView from "../pages/Ledgers/CashBankLedgerView.jsx";
import LedgersList from "../pages/Ledgers/LedgersList.jsx";
import SupplierPaymentList from "../pages/Payments/SupplierPaymentList.jsx";
import CompanyActivityLedger from "../pages/Ledgers/CompanyActivityLedger.jsx";
import PagesList from "../pages/Reports/Pages.jsx";
import ReportsPage from "../pages/Reports/ReportsList.jsx";
import GstSummaryList from "../pages/Reports/GstSummaryList.jsx";
import BalanceSheetList from "../pages/Reports/BalanceSheetList.jsx";
import ProfitLossList from "../pages/Reports/ProfitLossList.jsx";
import BalancesSummaryList from "../pages/Reports/BalancesSummaryList.jsx";
import InvoiceView from "../pages/Invoices/InvoiceView.jsx";
//import LedgersList from "../pages/Ledgers/LedgersList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,

    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "admin",
        element: <Dashboard />,
      },

      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "/admin/posts",
        element: <StockList />,
      },

      {
        path: "/admin/categories",
        element: <StockList />,
      },

      {
        path: "/admin/pages",
        element: <StockList />,
      },

      {
        path: "/admin/magazines",
        element: <StockList />,
      },

      {
        path: "/admin/stock",
        element: <StockList />,
      },

      {
        path: "/admin/customers",
        element: <CustomersList />,
      },

      {
        path: "/admin/suppliers",
        element: <SupplierList />,
      },

      {
        path: "/admin/products",
        element: <ProductsList />,
      },

      {
        path: "/admin/invoices",
        element: <InvoicesList />,
      },
      { path: "admin/invoices/:id", element: <InvoiceView /> },
      {
        path: "/admin/purchases",
        element: <PurchaseList />,
      },
      {
        path: "/admin/payments",
        element: <PaymentsList/>,
      },
      {
        path: "/admin/payment-received",
        element: <PaymentReceivedList />,
      },
      {
        path: "/admin/supplier-payments",
        element: <SupplierPaymentList />,
      },
      {
        path: "/admin/expenses",
        element: <ExpenseList />,
      },

      {
        path: "/admin/cash-vouchers",
        element: <CashVoucherList />,
      },

      // {
      //   path: "/admin/ledgers",
      //   element: <LedgersList />,
      // },
      {
        path: "/admin/ledgers/company",
        element: <CompanyActivityLedger />,
      },
      {
        path: "/admin/ledgers/customers/:id",
        element: <CustomerLedgerView />,
      },

      {
        path: "/admin/ledgers/suppliers/:id",
        element: <SupplierLedgerView />,
      },

      {
        path: "/admin/ledgers/cash",
        element: <CashBankLedgerView type="cash" />,
      },

      {
        path: "/admin/ledgers/bank",
        element: <CashBankLedgerView type="bank" />,
      },
      {
        path: "/admin/ledgers",
        element: <LedgersList/>,
      },
       {
        path: "/admin/reports",
        element: <ReportsPage/>,
      },
      {
  path: "/admin/reports/gst-summary",
  element: <GstSummaryList />,
},
{
  path: "/admin/reports/balances-summary",
  element: <BalancesSummaryList />,
},
{
  path: "/admin/reports/balance-sheet",
  element: <BalanceSheetList/>
},
{
  path: "/admin/reports/profit-and-loss",
  element: <ProfitLossList />,
},

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;