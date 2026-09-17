import React from "react";
import PaginatedTable from "../../components/crud/PaginatedList";

export default function PaymentsList() {
  const columns = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (item) => item.invoice?.invoice_number || "—",
    },
    {
      key: "amount",
      label: "Amount Received",
      render: (item) => `₹${Number(item.amount || 0).toFixed(2)}`,
    },
    {
      key: "method",
      label: "Payment Mode",
      render: (item) => item.method || "—",
    },
    {
      key: "reference_note",
      label: "Reference / Note",
      render: (item) => item.reference_note || "—",
    },
  ];

  return (
    <PaginatedTable
      module="payments"
      title="Payments Received"
      columns={columns}
    />
  );
}