import React from "react";
import PaginatedTable from "../../components/crud/PaginatedList";

export default function CompanyActivityLedger() {
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
      key: "party",
      label: "Party",
      render: (item) => item.party || "—",
    },
    {
      key: "debit",
      label: "Debit",
      render: (item) =>
        Number(item.debit || 0) > 0
          ? `₹${Number(item.debit).toFixed(2)}`
          : "—",
    },
    {
      key: "credit",
      label: "Credit",
      render: (item) =>
        Number(item.credit || 0) > 0
          ? `₹${Number(item.credit).toFixed(2)}`
          : "—",
    },
    {
      key: "payment_mode",
      label: "Payment Mode",
      render: (item) => item.payment_mode || "—",
    },
    {
      key: "notes",
      label: "Notes",
      render: (item) => item.notes || "—",
    },
  ];

  return (
    <PaginatedTable
      module="ledgers/company"
      title="Company Activity Ledger"
      columns={columns}
    />
  );
}