import PaginatedTable from "../../components/crud/PaginatedList";

export default function InvoiceList() {
  const columns = [
    {
      key: "invoice_number",
      label: "Invoice #",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) => item.customer?.name || "—",
    },
    {
      key: "total_amount",
      label: "Total",
      render: (item) => `₹${item.total_amount}`,
    },
    {
      key: "gst_amount",
      label: "GST",
      render: (item) => `₹${item.gst_amount}`,
    },
    {
      key: "grand_total",
      label: "Grand Total",
      render: (item) => `₹${item.grand_total}`,
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
      module="invoices"
      title="Invoices"
      columns={columns}
    />
  );
}