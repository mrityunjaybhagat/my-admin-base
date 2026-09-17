import PaginatedTable from "../../components/crud/PaginatedList";

export default function PurchaseList() {
  const columns = [
    {
      key: "purchase_number",
      label: "Purchase #",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (item) => item.supplier?.name || "-",
    },
    {
      key: "total_amount",
      label: "Subtotal",
      render: (item) =>
        `₹${Number(item.total_amount || 0).toFixed(2)}`,
    },
    {
      key: "gst_amount",
      label: "GST",
      render: (item) =>
        `₹${Number(item.gst_amount || 0).toFixed(2)}`,
    },
    {
      key: "grand_total",
      label: "Grand Total",
      render: (item) =>
        `₹${Number(item.grand_total || 0).toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  return (
    <PaginatedTable
      module="purchases"
      title="Purchases"
      columns={columns}
    />
  );
}