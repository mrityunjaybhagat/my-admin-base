import React from "react";
import PaginatedTable from "../../components/crud/PaginatedList";

export default function SupplierPaymentList() {
  const columns = [
    { key: "date", label: "Date" },

    {
      key: "supplier",
      label: "Supplier",
      render: (item) =>
        item.supplier?.name ||
        "—",
    },

    {
      key: "purchase",
      label: "Purchase",
      render: (item) =>
        item.purchase?.purchase_number ||
        item.purchase_number ||
        (item.purchase_id ? `#${item.purchase_id}` : "—"),
    },

    {
      key: "amount",
      label: "Amount",
      render: (item) =>
        `₹${Number(item.amount || 0).toFixed(2)}`,
    },

    {
      key: "method",
      label: "Payment Mode",
      render: (item) =>
        item.method ||
        item.payment_mode ||
        "—",
    },

    {
      key: "reference_note",
      label: "Reference",
      render: (item) =>
        item.reference_note ||
        item.reference ||
        "—",
    },
  ];

  return (
    <PaginatedTable
      module="supplier-payments"
      title="Supplier Payments"
      columns={columns}
    />
  );
}