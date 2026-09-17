import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import PaginatedTable from "../../components/crud/PaginatedList";

export default function CustomerLedgerView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const columns = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "reference",
      label: "Reference",
      render: (item) => item.reference || "—",
    },
    {
      key: "debit",
      label: "Debit",
      render: (item) =>
        Number(item.debit) > 0
          ? `₹${Number(item.debit).toFixed(2)}`
          : "—",
    },
    {
      key: "credit",
      label: "Credit",
      render: (item) =>
        Number(item.credit) > 0
          ? `₹${Number(item.credit).toFixed(2)}`
          : "—",
    },
    {
      key: "balance",
      label: "Balance",
      render: (item) =>
        `₹${Number(item.balance || 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <button
        className="link-btn"
        onClick={() => navigate("/admin/customers")}
      >
        <ChevronLeft size={15} />
        Back to Customers
      </button>

      <PaginatedTable
        module={`ledgers/customers/${id}`}
        title="Customer Ledger"
        columns={columns}
      />
    </div>
  );
}