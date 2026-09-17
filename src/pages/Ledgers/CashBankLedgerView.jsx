import React from "react";

import PaginatedTable from "../../components/crud/PaginatedList";

export default function CashBankLedgerView({ type }) {
  const isCash = type === "cash";

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
      key: "credit",
      label: "In",
      render: (item) =>
        Number(item.credit) > 0
          ? `₹${Number(item.credit).toFixed(2)}`
          : "—",
    },
    {
      key: "debit",
      label: "Out",
      render: (item) =>
        Number(item.debit) > 0
          ? `₹${Number(item.debit).toFixed(2)}`
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
    <PaginatedTable
      module={isCash ? "ledgers/cash" : "ledgers/bank"}
      title={`${isCash ? "Cash" : "Bank"} Ledger`}
      columns={columns}
    />
  );
}